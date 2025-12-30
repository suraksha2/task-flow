import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { User } from '../users/entities/user.entity';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(createCommentDto: CreateCommentDto, user: User): Promise<import("./entities/comment.entity").Comment>;
    findAll(taskId: string, user: User): Promise<import("./entities/comment.entity").Comment[]>;
    findOne(id: string, user: User): Promise<import("./entities/comment.entity").Comment>;
    update(id: string, updateCommentDto: UpdateCommentDto, user: User): Promise<import("./entities/comment.entity").Comment>;
    remove(id: string, user: User): Promise<void>;
}
