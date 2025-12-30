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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../../../common/enums");
const project_entity_1 = require("../../projects/entities/project.entity");
const task_entity_1 = require("../../tasks/entities/task.entity");
const comment_entity_1 = require("../../comments/entities/comment.entity");
const activity_entity_1 = require("../../activity/entities/activity.entity");
let User = class User {
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.Role, default: enums_1.Role.USER }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => project_entity_1.Project, (project) => project.owner),
    __metadata("design:type", Array)
], User.prototype, "ownedProjects", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => project_entity_1.Project, (project) => project.members),
    __metadata("design:type", Array)
], User.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_entity_1.Task, (task) => task.assignee),
    __metadata("design:type", Array)
], User.prototype, "assignedTasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_entity_1.Task, (task) => task.reporter),
    __metadata("design:type", Array)
], User.prototype, "reportedTasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.author),
    __metadata("design:type", Array)
], User.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => activity_entity_1.Activity, (activity) => activity.user),
    __metadata("design:type", Array)
], User.prototype, "activities", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map