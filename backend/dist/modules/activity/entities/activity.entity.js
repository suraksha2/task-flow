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
exports.Activity = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const user_entity_1 = require("../../users/entities/user.entity");
const project_entity_1 = require("../../projects/entities/project.entity");
const task_entity_1 = require("../../tasks/entities/task.entity");
let Activity = class Activity {
};
exports.Activity = Activity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Activity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.ActivityType }),
    __metadata("design:type", String)
], Activity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Activity.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Activity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.activities),
    __metadata("design:type", user_entity_1.User)
], Activity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Activity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, (project) => project.activities, { onDelete: 'CASCADE' }),
    __metadata("design:type", project_entity_1.Project)
], Activity.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Activity.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_entity_1.Task, (task) => task.activities, { nullable: true, onDelete: 'CASCADE' }),
    __metadata("design:type", task_entity_1.Task)
], Activity.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "taskId", void 0);
exports.Activity = Activity = __decorate([
    (0, typeorm_1.Entity)('activities')
], Activity);
//# sourceMappingURL=activity.entity.js.map