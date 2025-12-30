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
exports.BoardsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const boards_service_1 = require("./boards.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let BoardsController = class BoardsController {
    constructor(boardsService) {
        this.boardsService = boardsService;
    }
    create(createBoardDto, user) {
        return this.boardsService.create(createBoardDto, user);
    }
    findAll(projectId, user) {
        return this.boardsService.findAllByProject(projectId, user);
    }
    findOne(id, user) {
        return this.boardsService.findOne(id, user);
    }
    update(id, updateBoardDto, user) {
        return this.boardsService.update(id, updateBoardDto, user);
    }
    remove(id, user) {
        return this.boardsService.remove(id, user);
    }
    reorder(body, user) {
        return this.boardsService.reorder(body.projectId, body.boardIds, user);
    }
};
exports.BoardsController = BoardsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new board' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateBoardDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all boards for a project' }),
    __param(0, (0, common_1.Query)('projectId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get board by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update board' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateBoardDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete board' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder boards' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "reorder", null);
exports.BoardsController = BoardsController = __decorate([
    (0, swagger_1.ApiTags)('Boards'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/boards'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [boards_service_1.BoardsService])
], BoardsController);
//# sourceMappingURL=boards.controller.js.map