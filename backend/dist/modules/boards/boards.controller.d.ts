import { BoardsService } from './boards.service';
import { CreateBoardDto, UpdateBoardDto } from './dto';
import { User } from '../users/entities/user.entity';
export declare class BoardsController {
    private readonly boardsService;
    constructor(boardsService: BoardsService);
    create(createBoardDto: CreateBoardDto, user: User): Promise<import("./entities/board.entity").Board>;
    findAll(projectId: string, user: User): Promise<import("./entities/board.entity").Board[]>;
    findOne(id: string, user: User): Promise<import("./entities/board.entity").Board>;
    update(id: string, updateBoardDto: UpdateBoardDto, user: User): Promise<import("./entities/board.entity").Board>;
    remove(id: string, user: User): Promise<void>;
    reorder(body: {
        projectId: string;
        boardIds: string[];
    }, user: User): Promise<import("./entities/board.entity").Board[]>;
}
