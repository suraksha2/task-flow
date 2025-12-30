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
exports.ActivityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const activity_service_1 = require("./activity.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let ActivityController = class ActivityController {
    constructor(activityService) {
        this.activityService = activityService;
    }
    findByProject(projectId, limit) {
        return this.activityService.findByProject(projectId, limit);
    }
    findByTask(taskId, limit) {
        return this.activityService.findByTask(taskId, limit);
    }
    findMyActivity(user, limit) {
        return this.activityService.findByUser(user.id, limit);
    }
};
exports.ActivityController = ActivityController;
__decorate([
    (0, common_1.Get)('project'),
    (0, swagger_1.ApiOperation)({ summary: 'Get activity log for a project' }),
    __param(0, (0, common_1.Query)('projectId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], ActivityController.prototype, "findByProject", null);
__decorate([
    (0, common_1.Get)('task'),
    (0, swagger_1.ApiOperation)({ summary: 'Get activity log for a task' }),
    __param(0, (0, common_1.Query)('taskId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], ActivityController.prototype, "findByTask", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user activity' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", void 0)
], ActivityController.prototype, "findMyActivity", null);
exports.ActivityController = ActivityController = __decorate([
    (0, swagger_1.ApiTags)('Activity'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/activity'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [activity_service_1.ActivityService])
], ActivityController);
//# sourceMappingURL=activity.controller.js.map