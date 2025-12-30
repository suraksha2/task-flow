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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./entities/task.entity");
const boards_service_1 = require("../boards/boards.service");
const activity_service_1 = require("../activity/activity.service");
const enums_1 = require("../../common/enums");
const email_service_1 = require("../email/email.service");
let TasksService = class TasksService {
    constructor(tasksRepository, boardsService, activityService, emailService) {
        this.tasksRepository = tasksRepository;
        this.boardsService = boardsService;
        this.activityService = activityService;
        this.emailService = emailService;
    }
    async create(createTaskDto, user) {
        const board = await this.boardsService.findOne(createTaskDto.boardId, user);
        const taskCount = await this.tasksRepository.count({
            where: { boardId: board.id },
        });
        const projectKey = board.project?.key || 'TASK';
        const taskKey = `${projectKey}-${taskCount + 1}`;
        const maxPosition = await this.tasksRepository
            .createQueryBuilder('task')
            .where('task.boardId = :boardId', { boardId: board.id })
            .andWhere('task.status = :status', { status: createTaskDto.status || enums_1.TaskStatus.TODO })
            .select('MAX(task.position)', 'max')
            .getRawOne();
        const task = this.tasksRepository.create({
            ...createTaskDto,
            taskKey,
            reporterId: user.id,
            position: (maxPosition?.max ?? -1) + 1,
        });
        const savedTask = await this.tasksRepository.save(task);
        await this.activityService.create({
            type: enums_1.ActivityType.TASK_CREATED,
            description: `Task "${task.title}" was created`,
            userId: user.id,
            projectId: board.projectId,
            taskId: savedTask.id,
        });
        if (createTaskDto.assigneeId) {
            await this.emailService.sendTaskAssignedEmail(savedTask);
        }
        return this.findOne(savedTask.id, user);
    }
    async findAllByBoard(boardId, user) {
        await this.boardsService.findOne(boardId, user);
        return this.tasksRepository.find({
            where: { boardId },
            relations: ['assignee', 'reporter'],
            order: { status: 'ASC', position: 'ASC' },
        });
    }
    async findOne(id, user) {
        const task = await this.tasksRepository.findOne({
            where: { id },
            relations: ['board', 'board.project', 'assignee', 'reporter', 'comments', 'comments.author'],
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        await this.boardsService.findOne(task.boardId, user);
        return task;
    }
    async update(id, updateTaskDto, user) {
        const task = await this.findOne(id, user);
        const oldAssigneeId = task.assigneeId;
        Object.assign(task, updateTaskDto);
        const updatedTask = await this.tasksRepository.save(task);
        await this.activityService.create({
            type: enums_1.ActivityType.TASK_UPDATED,
            description: `Task "${task.title}" was updated`,
            userId: user.id,
            projectId: task.board.projectId,
            taskId: task.id,
            metadata: updateTaskDto,
        });
        if (updateTaskDto.assigneeId && updateTaskDto.assigneeId !== oldAssigneeId) {
            await this.emailService.sendTaskAssignedEmail(updatedTask);
            await this.activityService.create({
                type: enums_1.ActivityType.TASK_ASSIGNED,
                description: `Task "${task.title}" was assigned`,
                userId: user.id,
                projectId: task.board.projectId,
                taskId: task.id,
            });
        }
        return this.findOne(id, user);
    }
    async move(id, moveTaskDto, user) {
        const task = await this.findOne(id, user);
        const oldStatus = task.status;
        task.status = moveTaskDto.status;
        task.position = moveTaskDto.position;
        await this.tasksRepository.save(task);
        await this.activityService.create({
            type: enums_1.ActivityType.TASK_MOVED,
            description: `Task "${task.title}" moved from ${oldStatus} to ${moveTaskDto.status}`,
            userId: user.id,
            projectId: task.board.projectId,
            taskId: task.id,
            metadata: { from: oldStatus, to: moveTaskDto.status },
        });
        return this.findOne(id, user);
    }
    async remove(id, user) {
        const task = await this.findOne(id, user);
        await this.activityService.create({
            type: enums_1.ActivityType.TASK_DELETED,
            description: `Task "${task.title}" was deleted`,
            userId: user.id,
            projectId: task.board.projectId,
        });
        await this.tasksRepository.remove(task);
    }
    async reorderTasks(boardId, status, taskIds, user) {
        await this.boardsService.findOne(boardId, user);
        await Promise.all(taskIds.map((id, index) => this.tasksRepository.update(id, { position: index })));
        return this.findAllByBoard(boardId, user);
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        boards_service_1.BoardsService,
        activity_service_1.ActivityService,
        email_service_1.EmailService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map