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
exports.BoardsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const board_entity_1 = require("./entities/board.entity");
const projects_service_1 = require("../projects/projects.service");
const activity_service_1 = require("../activity/activity.service");
const enums_1 = require("../../common/enums");
let BoardsService = class BoardsService {
    constructor(boardsRepository, projectsService, activityService) {
        this.boardsRepository = boardsRepository;
        this.projectsService = projectsService;
        this.activityService = activityService;
    }
    async create(createBoardDto, user) {
        const project = await this.projectsService.findOne(createBoardDto.projectId, user);
        const maxPosition = await this.boardsRepository
            .createQueryBuilder('board')
            .where('board.projectId = :projectId', { projectId: project.id })
            .select('MAX(board.position)', 'max')
            .getRawOne();
        const board = this.boardsRepository.create({
            ...createBoardDto,
            position: (maxPosition?.max ?? -1) + 1,
        });
        const savedBoard = await this.boardsRepository.save(board);
        await this.activityService.create({
            type: enums_1.ActivityType.BOARD_CREATED,
            description: `Board "${board.name}" was created`,
            userId: user.id,
            projectId: project.id,
        });
        return savedBoard;
    }
    async findAllByProject(projectId, user) {
        await this.projectsService.findOne(projectId, user);
        return this.boardsRepository.find({
            where: { projectId },
            relations: ['tasks', 'tasks.assignee'],
            order: { position: 'ASC' },
        });
    }
    async findOne(id, user) {
        const board = await this.boardsRepository.findOne({
            where: { id },
            relations: ['project', 'tasks', 'tasks.assignee', 'tasks.reporter'],
        });
        if (!board) {
            throw new common_1.NotFoundException('Board not found');
        }
        await this.projectsService.findOne(board.projectId, user);
        return board;
    }
    async update(id, updateBoardDto, user) {
        const board = await this.findOne(id, user);
        Object.assign(board, updateBoardDto);
        const updatedBoard = await this.boardsRepository.save(board);
        await this.activityService.create({
            type: enums_1.ActivityType.BOARD_UPDATED,
            description: `Board "${board.name}" was updated`,
            userId: user.id,
            projectId: board.projectId,
        });
        return updatedBoard;
    }
    async remove(id, user) {
        const board = await this.findOne(id, user);
        await this.boardsRepository.remove(board);
    }
    async reorder(projectId, boardIds, user) {
        await this.projectsService.findOne(projectId, user);
        await Promise.all(boardIds.map((id, index) => this.boardsRepository.update(id, { position: index })));
        return this.findAllByProject(projectId, user);
    }
};
exports.BoardsService = BoardsService;
exports.BoardsService = BoardsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(board_entity_1.Board)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        projects_service_1.ProjectsService,
        activity_service_1.ActivityService])
], BoardsService);
//# sourceMappingURL=boards.service.js.map