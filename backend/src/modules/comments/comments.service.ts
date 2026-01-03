import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { User } from '../users/entities/user.entity';
import { TasksService } from '../tasks/tasks.service';
import { ActivityService } from '../activity/activity.service';
import { ActivityType, Role } from '../../common/enums';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private tasksService: TasksService,
    private activityService: ActivityService,
    private websocketGateway: WebsocketGateway,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
    const task = await this.tasksService.findOne(createCommentDto.taskId, user);

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      authorId: user.id,
    });

    const savedComment = await this.commentsRepository.save(comment);

    await this.activityService.create({
      type: ActivityType.COMMENT_ADDED,
      description: `Comment added to task "${task.title}"`,
      userId: user.id,
      projectId: task.board.projectId,
      taskId: task.id,
    });

    const fullComment = await this.findOne(savedComment.id, user);

    // Emit real-time comment added event
    this.websocketGateway.emitCommentAdded(task.id, task.boardId, fullComment);

    // Notify task assignee if different from commenter
    if (task.assigneeId && task.assigneeId !== user.id) {
      this.websocketGateway.emitNotification(task.assigneeId, {
        type: 'comment_added',
        title: 'New Comment',
        message: `${user.firstName} commented on task "${task.title}"`,
        data: { taskId: task.id, commentId: fullComment.id },
      });
    }

    // Notify task reporter if different from commenter and assignee
    if (task.reporterId && task.reporterId !== user.id && task.reporterId !== task.assigneeId) {
      this.websocketGateway.emitNotification(task.reporterId, {
        type: 'comment_added',
        title: 'New Comment',
        message: `${user.firstName} commented on task "${task.title}"`,
        data: { taskId: task.id, commentId: fullComment.id },
      });
    }

    return fullComment;
  }

  async findAllByTask(taskId: string, user: User): Promise<Comment[]> {
    await this.tasksService.findOne(taskId, user);

    return this.commentsRepository.find({
      where: { taskId },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string, user: User): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author', 'task', 'task.board'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.tasksService.findOne(comment.taskId, user);

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, user: User): Promise<Comment> {
    const comment = await this.findOne(id, user);

    if (comment.authorId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    comment.content = updateCommentDto.content;
    await this.commentsRepository.save(comment);

    await this.activityService.create({
      type: ActivityType.COMMENT_UPDATED,
      description: `Comment updated on task "${comment.task.title}"`,
      userId: user.id,
      projectId: comment.task.board.projectId,
      taskId: comment.taskId,
    });

    return this.findOne(id, user);
  }

  async remove(id: string, user: User): Promise<void> {
    const comment = await this.findOne(id, user);

    if (comment.authorId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.activityService.create({
      type: ActivityType.COMMENT_DELETED,
      description: `Comment deleted from task "${comment.task.title}"`,
      userId: user.id,
      projectId: comment.task.board.projectId,
      taskId: comment.taskId,
    });

    const taskId = comment.taskId;
    const boardId = comment.task.boardId;
    const commentId = comment.id;
    await this.commentsRepository.remove(comment);

    // Emit real-time comment deleted event
    this.websocketGateway.emitCommentDeleted(taskId, boardId, commentId);
  }
}
