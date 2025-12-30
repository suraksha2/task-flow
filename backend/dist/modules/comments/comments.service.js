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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("./entities/comment.entity");
const tasks_service_1 = require("../tasks/tasks.service");
const activity_service_1 = require("../activity/activity.service");
const enums_1 = require("../../common/enums");
let CommentsService = class CommentsService {
    constructor(commentsRepository, tasksService, activityService) {
        this.commentsRepository = commentsRepository;
        this.tasksService = tasksService;
        this.activityService = activityService;
    }
    async create(createCommentDto, user) {
        const task = await this.tasksService.findOne(createCommentDto.taskId, user);
        const comment = this.commentsRepository.create({
            ...createCommentDto,
            authorId: user.id,
        });
        const savedComment = await this.commentsRepository.save(comment);
        await this.activityService.create({
            type: enums_1.ActivityType.COMMENT_ADDED,
            description: `Comment added to task "${task.title}"`,
            userId: user.id,
            projectId: task.board.projectId,
            taskId: task.id,
        });
        return this.findOne(savedComment.id, user);
    }
    async findAllByTask(taskId, user) {
        await this.tasksService.findOne(taskId, user);
        return this.commentsRepository.find({
            where: { taskId },
            relations: ['author'],
            order: { createdAt: 'ASC' },
        });
    }
    async findOne(id, user) {
        const comment = await this.commentsRepository.findOne({
            where: { id },
            relations: ['author', 'task', 'task.board'],
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        await this.tasksService.findOne(comment.taskId, user);
        return comment;
    }
    async update(id, updateCommentDto, user) {
        const comment = await this.findOne(id, user);
        if (comment.authorId !== user.id && user.role !== enums_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('You can only edit your own comments');
        }
        comment.content = updateCommentDto.content;
        await this.commentsRepository.save(comment);
        await this.activityService.create({
            type: enums_1.ActivityType.COMMENT_UPDATED,
            description: `Comment updated on task "${comment.task.title}"`,
            userId: user.id,
            projectId: comment.task.board.projectId,
            taskId: comment.taskId,
        });
        return this.findOne(id, user);
    }
    async remove(id, user) {
        const comment = await this.findOne(id, user);
        if (comment.authorId !== user.id && user.role !== enums_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('You can only delete your own comments');
        }
        await this.activityService.create({
            type: enums_1.ActivityType.COMMENT_DELETED,
            description: `Comment deleted from task "${comment.task.title}"`,
            userId: user.id,
            projectId: comment.task.board.projectId,
            taskId: comment.taskId,
        });
        await this.commentsRepository.remove(comment);
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        tasks_service_1.TasksService,
        activity_service_1.ActivityService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map