import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { User } from '../users/entities/user.entity';
import { TasksService } from '../tasks/tasks.service';
import { ActivityService } from '../activity/activity.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
export declare class CommentsService {
    private commentsRepository;
    private tasksService;
    private activityService;
    private websocketGateway;
    constructor(commentsRepository: Repository<Comment>, tasksService: TasksService, activityService: ActivityService, websocketGateway: WebsocketGateway);
    create(createCommentDto: CreateCommentDto, user: User): Promise<Comment>;
    findAllByTask(taskId: string, user: User): Promise<Comment[]>;
    findOne(id: string, user: User): Promise<Comment>;
    update(id: string, updateCommentDto: UpdateCommentDto, user: User): Promise<Comment>;
    remove(id: string, user: User): Promise<void>;
}
