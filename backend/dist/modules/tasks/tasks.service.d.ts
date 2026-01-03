import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto, UpdateTaskDto, MoveTaskDto } from './dto';
import { User } from '../users/entities/user.entity';
import { BoardsService } from '../boards/boards.service';
import { ActivityService } from '../activity/activity.service';
import { TaskStatus } from '../../common/enums';
import { EmailService } from '../email/email.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
export declare class TasksService {
    private tasksRepository;
    private boardsService;
    private activityService;
    private emailService;
    private websocketGateway;
    constructor(tasksRepository: Repository<Task>, boardsService: BoardsService, activityService: ActivityService, emailService: EmailService, websocketGateway: WebsocketGateway);
    create(createTaskDto: CreateTaskDto, user: User): Promise<Task>;
    findAllByBoard(boardId: string, user: User): Promise<Task[]>;
    findOne(id: string, user: User): Promise<Task>;
    update(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task>;
    move(id: string, moveTaskDto: MoveTaskDto, user: User): Promise<Task>;
    remove(id: string, user: User): Promise<void>;
    reorderTasks(boardId: string, status: TaskStatus, taskIds: string[], user: User): Promise<Task[]>;
}
