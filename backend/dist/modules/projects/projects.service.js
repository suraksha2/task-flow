"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("./entities/project.entity");
const enums_1 = require("../../common/enums");
const activity_service_1 = require("../activity/activity.service");
const enums_2 = require("../../common/enums");
let ProjectsService = class ProjectsService {
    constructor(projectsRepository, activityService) {
        this.projectsRepository = projectsRepository;
        this.activityService = activityService;
    }
    async create(createProjectDto, user) {
        const existingProject = await this.projectsRepository.findOne({
            where: { key: createProjectDto.key },
        });
        if (existingProject) {
            throw new common_1.ConflictException('Project key already exists');
        }
        const project = this.projectsRepository.create({
            ...createProjectDto,
            owner: user,
            ownerId: user.id,
            members: [user],
        });
        const savedProject = await this.projectsRepository.save(project);
        await this.activityService.create({
            type: enums_2.ActivityType.PROJECT_CREATED,
            description: `Project "${project.name}" was created`,
            userId: user.id,
            projectId: savedProject.id,
        });
        return savedProject;
    }
    async findAll(user) {
        if (user.role === enums_1.Role.ADMIN) {
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
    async findOne(id, user) {
        const project = await this.projectsRepository.findOne({
            where: { id },
            relations: ['owner', 'members', 'boards'],
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (!this.hasAccess(project, user)) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return project;
    }
    async update(id, updateProjectDto, user) {
        const project = await this.findOne(id, user);
        if (!this.canModify(project, user)) {
            throw new common_1.ForbiddenException('Only owner or admin can modify project');
        }
        Object.assign(project, updateProjectDto);
        const updatedProject = await this.projectsRepository.save(project);
        await this.activityService.create({
            type: enums_2.ActivityType.PROJECT_UPDATED,
            description: `Project "${project.name}" was updated`,
            userId: user.id,
            projectId: project.id,
        });
        return updatedProject;
    }
    async remove(id, user) {
        const project = await this.findOne(id, user);
        if (!this.canModify(project, user)) {
            throw new common_1.ForbiddenException('Only owner or admin can delete project');
        }
        await this.projectsRepository.remove(project);
    }
    async addMember(projectId, memberId, user) {
        const project = await this.projectsRepository.findOne({
            where: { id: projectId },
            relations: ['members'],
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (!this.canModify(project, user)) {
            throw new common_1.ForbiddenException('Only owner or admin can add members');
        }
        const isMember = project.members.some((m) => m.id === memberId);
        if (!isMember) {
            project.members.push({ id: memberId });
            await this.projectsRepository.save(project);
            await this.activityService.create({
                type: enums_2.ActivityType.MEMBER_ADDED,
                description: `A new member was added to the project`,
                userId: user.id,
                projectId: project.id,
            });
        }
        return this.findOne(projectId, user);
    }
    async removeMember(projectId, memberId, user) {
        const project = await this.projectsRepository.findOne({
            where: { id: projectId },
            relations: ['members'],
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (!this.canModify(project, user)) {
            throw new common_1.ForbiddenException('Only owner or admin can remove members');
        }
        if (project.ownerId === memberId) {
            throw new common_1.ForbiddenException('Cannot remove project owner');
        }
        project.members = project.members.filter((m) => m.id !== memberId);
        await this.projectsRepository.save(project);
        await this.activityService.create({
            type: enums_2.ActivityType.MEMBER_REMOVED,
            description: `A member was removed from the project`,
            userId: user.id,
            projectId: project.id,
        });
        return this.findOne(projectId, user);
    }
    hasAccess(project, user) {
        if (user.role === enums_1.Role.ADMIN)
            return true;
        if (project.ownerId === user.id)
            return true;
        return project.members?.some((m) => m.id === user.id) ?? false;
    }
    canModify(project, user) {
        if (user.role === enums_1.Role.ADMIN)
            return true;
        if (project.ownerId === user.id)
            return true;
        if (user.role === enums_1.Role.MANAGER) {
            return project.members?.some((m) => m.id === user.id) ?? false;
        }
        return false;
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        activity_service_1.ActivityService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map