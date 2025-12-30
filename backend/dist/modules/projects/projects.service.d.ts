import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { User } from '../users/entities/user.entity';
import { ActivityService } from '../activity/activity.service';
export declare class ProjectsService {
    private projectsRepository;
    private activityService;
    constructor(projectsRepository: Repository<Project>, activityService: ActivityService);
    create(createProjectDto: CreateProjectDto, user: User): Promise<Project>;
    findAll(user: User): Promise<Project[]>;
    findOne(id: string, user: User): Promise<Project>;
    update(id: string, updateProjectDto: UpdateProjectDto, user: User): Promise<Project>;
    remove(id: string, user: User): Promise<void>;
    addMember(projectId: string, memberId: string, user: User): Promise<Project>;
    removeMember(projectId: string, memberId: string, user: User): Promise<Project>;
    private hasAccess;
    private canModify;
}
