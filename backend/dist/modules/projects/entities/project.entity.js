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
exports.Project = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const board_entity_1 = require("../../boards/entities/board.entity");
const activity_entity_1 = require("../../activity/entities/activity.entity");
let Project = class Project {
};
exports.Project = Project;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Project.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Project.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Project.prototype, "key", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Project.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.ownedProjects, { eager: true }),
    __metadata("design:type", user_entity_1.User)
], Project.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.projects),
    (0, typeorm_1.JoinTable)({
        name: 'project_members',
        joinColumn: { name: 'projectId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Project.prototype, "members", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => board_entity_1.Board, (board) => board.project),
    __metadata("design:type", Array)
], Project.prototype, "boards", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => activity_entity_1.Activity, (activity) => activity.project),
    __metadata("design:type", Array)
], Project.prototype, "activities", void 0);
exports.Project = Project = __decorate([
    (0, typeorm_1.Entity)('projects')
], Project);
//# sourceMappingURL=project.entity.js.map