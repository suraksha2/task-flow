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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const board_entity_1 = require("../../boards/entities/board.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const comment_entity_1 = require("../../comments/entities/comment.entity");
const activity_entity_1 = require("../../activity/entities/activity.entity");
let Task = class Task {
};
exports.Task = Task;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Task.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Task.prototype, "taskKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.TaskStatus, default: enums_1.TaskStatus.TODO }),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.TaskPriority, default: enums_1.TaskPriority.MEDIUM }),
    __metadata("design:type", String)
], Task.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Task.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Task.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Task.prototype, "estimatedHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Task.prototype, "loggedHours", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], Task.prototype, "labels", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Task.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Task.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => board_entity_1.Board, (board) => board.tasks, { onDelete: 'CASCADE' }),
    __metadata("design:type", board_entity_1.Board)
], Task.prototype, "board", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "boardId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.assignedTasks, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], Task.prototype, "assignee", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "assigneeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.reportedTasks),
    __metadata("design:type", user_entity_1.User)
], Task.prototype, "reporter", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "reporterId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.task),
    __metadata("design:type", Array)
], Task.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => activity_entity_1.Activity, (activity) => activity.task),
    __metadata("design:type", Array)
], Task.prototype, "activities", void 0);
exports.Task = Task = __decorate([
    (0, typeorm_1.Entity)('tasks')
], Task);
//# sourceMappingURL=task.entity.js.map