import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { CreateBoardDto, UpdateBoardDto } from './dto';
import { User } from '../users/entities/user.entity';
import { ProjectsService } from '../projects/projects.service';
import { ActivityService } from '../activity/activity.service';
export declare class BoardsService {
    private boardsRepository;
    private projectsService;
    private activityService;
    constructor(boardsRepository: Repository<Board>, projectsService: ProjectsService, activityService: ActivityService);
    create(createBoardDto: CreateBoardDto, user: User): Promise<Board>;
    findAllByProject(projectId: string, user: User): Promise<Board[]>;
    findOne(id: string, user: User): Promise<Board>;
    update(id: string, updateBoardDto: UpdateBoardDto, user: User): Promise<Board>;
    remove(id: string, user: User): Promise<void>;
    reorder(projectId: string, boardIds: string[], user: User): Promise<Board[]>;
}
