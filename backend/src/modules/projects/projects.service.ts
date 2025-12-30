import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { User } from '../users/entities/user.entity';
import { Role } from '../../common/enums';
import { ActivityService } from '../activity/activity.service';
import { ActivityType } from '../../common/enums';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private activityService: ActivityService,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User): Promise<Project> {
    const existingProject = await this.projectsRepository.findOne({
      where: { key: createProjectDto.key },
    });
    if (existingProject) {
      throw new ConflictException('Project key already exists');
    }

    const project = this.projectsRepository.create({
      ...createProjectDto,
      owner: user,
      ownerId: user.id,
      members: [user],
    });

    const savedProject = await this.projectsRepository.save(project);

    await this.activityService.create({
      type: ActivityType.PROJECT_CREATED,
      description: `Project "${project.name}" was created`,
      userId: user.id,
      projectId: savedProject.id,
    });

    return savedProject;
  }

  async findAll(user: User): Promise<Project[]> {
    if (user.role === Role.ADMIN) {
      return this.projectsRepository.find({
        relations: ['owner', 'members'],
      });
    }

    return this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.members', 'members')
      .where('project.ownerId = :userId', { userId: user.id })
      .orWhere('members.id = :userId', { userId: user.id })
      .getMany();
  }

  async findOne(id: string, user: User): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['owner', 'members', 'boards'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (!this.hasAccess(project, user)) {
      throw new ForbiddenException('Access denied');
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    user: User,
  ): Promise<Project> {
    const project = await this.findOne(id, user);

    if (!this.canModify(project, user)) {
      throw new ForbiddenException('Only owner or admin can modify project');
    }

    Object.assign(project, updateProjectDto);
    const updatedProject = await this.projectsRepository.save(project);

    await this.activityService.create({
      type: ActivityType.PROJECT_UPDATED,
      description: `Project "${project.name}" was updated`,
      userId: user.id,
      projectId: project.id,
    });

    return updatedProject;
  }

  async remove(id: string, user: User): Promise<void> {
    const project = await this.findOne(id, user);

    if (!this.canModify(project, user)) {
      throw new ForbiddenException('Only owner or admin can delete project');
    }

    await this.projectsRepository.remove(project);
  }

  async addMember(projectId: string, memberId: string, user: User): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
      relations: ['members'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (!this.canModify(project, user)) {
      throw new ForbiddenException('Only owner or admin can add members');
    }

    const isMember = project.members.some((m) => m.id === memberId);
    if (!isMember) {
      project.members.push({ id: memberId } as User);
      await this.projectsRepository.save(project);

      await this.activityService.create({
        type: ActivityType.MEMBER_ADDED,
        description: `A new member was added to the project`,
        userId: user.id,
        projectId: project.id,
      });
    }

    return this.findOne(projectId, user);
  }

  async removeMember(projectId: string, memberId: string, user: User): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
      relations: ['members'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (!this.canModify(project, user)) {
      throw new ForbiddenException('Only owner or admin can remove members');
    }

    if (project.ownerId === memberId) {
      throw new ForbiddenException('Cannot remove project owner');
    }

    project.members = project.members.filter((m) => m.id !== memberId);
    await this.projectsRepository.save(project);

    await this.activityService.create({
      type: ActivityType.MEMBER_REMOVED,
      description: `A member was removed from the project`,
      userId: user.id,
      projectId: project.id,
    });

    return this.findOne(projectId, user);
  }

  private hasAccess(project: Project, user: User): boolean {
    if (user.role === Role.ADMIN) return true;
    if (project.ownerId === user.id) return true;
    return project.members?.some((m) => m.id === user.id) ?? false;
  }

  private canModify(project: Project, user: User): boolean {
    if (user.role === Role.ADMIN) return true;
    if (project.ownerId === user.id) return true;
    if (user.role === Role.MANAGER) {
      return project.members?.some((m) => m.id === user.id) ?? false;
    }
    return false;
  }
}
