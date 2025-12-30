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

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private tasksService: TasksService,
    private activityService: ActivityService,
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

    return this.findOne(savedComment.id, user);
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

    await this.commentsRepository.remove(comment);
  }
}
