import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, MoveTaskDto } from './dto';
import { User } from '../users/entities/user.entity';
import { TaskStatus } from '../../common/enums';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto, user: User): Promise<import("./entities/task.entity").Task>;
    findAll(boardId: string, user: User): Promise<import("./entities/task.entity").Task[]>;
    findOne(id: string, user: User): Promise<import("./entities/task.entity").Task>;
    update(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<import("./entities/task.entity").Task>;
    move(id: string, moveTaskDto: MoveTaskDto, user: User): Promise<import("./entities/task.entity").Task>;
    remove(id: string, user: User): Promise<void>;
    reorder(body: {
        boardId: string;
        status: TaskStatus;
        taskIds: string[];
    }, user: User): Promise<import("./entities/task.entity").Task[]>;
}
