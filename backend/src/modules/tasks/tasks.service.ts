import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto, UpdateTaskDto, MoveTaskDto } from './dto';
import { User } from '../users/entities/user.entity';
import { BoardsService } from '../boards/boards.service';
import { ActivityService } from '../activity/activity.service';
import { ActivityType, TaskStatus } from '../../common/enums';
import { EmailService } from '../email/email.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private boardsService: BoardsService,
    private activityService: ActivityService,
    private emailService: EmailService,
    private websocketGateway: WebsocketGateway,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const board = await this.boardsService.findOne(createTaskDto.boardId, user);

    const taskCount = await this.tasksRepository.count({
      where: { boardId: board.id },
    });

    const projectKey = board.project?.key || 'TASK';
    const taskKey = `${projectKey}-${taskCount + 1}`;

    const maxPosition = await this.tasksRepository
      .createQueryBuilder('task')
      .where('task.boardId = :boardId', { boardId: board.id })
      .andWhere('task.status = :status', { status: createTaskDto.status || TaskStatus.TODO })
      .select('MAX(task.position)', 'max')
      .getRawOne();

    const task = this.tasksRepository.create({
      ...createTaskDto,
      taskKey,
      reporterId: user.id,
      position: (maxPosition?.max ?? -1) + 1,
    });

    const savedTask = await this.tasksRepository.save(task);

    await this.activityService.create({
      type: ActivityType.TASK_CREATED,
      description: `Task "${task.title}" was created`,
      userId: user.id,
      projectId: board.projectId,
      taskId: savedTask.id,
    });

    if (createTaskDto.assigneeId) {
      await this.emailService.sendTaskAssignedEmail(savedTask);
      
      // Send real-time notification to assignee
      this.websocketGateway.emitNotification(createTaskDto.assigneeId, {
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You have been assigned to task "${task.title}"`,
        data: { taskId: savedTask.id, boardId: board.id },
      });
    }

    // Emit real-time task created event
    const fullTask = await this.findOne(savedTask.id, user);
    this.websocketGateway.emitTaskCreated(board.id, fullTask);

    return fullTask;
  }

  async findAllByBoard(boardId: string, user: User): Promise<Task[]> {
    await this.boardsService.findOne(boardId, user);

    return this.tasksRepository.find({
      where: { boardId },
      relations: ['assignee', 'reporter'],
      order: { status: 'ASC', position: 'ASC' },
    });
  }

  async findOne(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['board', 'board.project', 'assignee', 'reporter', 'comments', 'comments.author'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.boardsService.findOne(task.boardId, user);

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
    const task = await this.findOne(id, user);
    const oldAssigneeId = task.assigneeId;

    Object.assign(task, updateTaskDto);
    const updatedTask = await this.tasksRepository.save(task);

    await this.activityService.create({
      type: ActivityType.TASK_UPDATED,
      description: `Task "${task.title}" was updated`,
      userId: user.id,
      projectId: task.board.projectId,
      taskId: task.id,
      metadata: updateTaskDto,
    });

    if (updateTaskDto.assigneeId && updateTaskDto.assigneeId !== oldAssigneeId) {
      await this.emailService.sendTaskAssignedEmail(updatedTask);

      await this.activityService.create({
        type: ActivityType.TASK_ASSIGNED,
        description: `Task "${task.title}" was assigned`,
        userId: user.id,
        projectId: task.board.projectId,
        taskId: task.id,
      });

      // Send real-time notification to new assignee
      this.websocketGateway.emitNotification(updateTaskDto.assigneeId, {
        type: 'task_assigned',
        title: 'Task Assigned',
        message: `You have been assigned to task "${task.title}"`,
        data: { taskId: task.id, boardId: task.boardId },
      });
    }

    // Emit real-time task updated event
    const fullTask = await this.findOne(id, user);
    this.websocketGateway.emitTaskUpdated(task.boardId, fullTask);

    return fullTask;
  }

  async move(id: string, moveTaskDto: MoveTaskDto, user: User): Promise<Task> {
    const task = await this.findOne(id, user);
    const oldStatus = task.status;

    task.status = moveTaskDto.status;
    task.position = moveTaskDto.position;

    await this.tasksRepository.save(task);

    await this.activityService.create({
      type: ActivityType.TASK_MOVED,
      description: `Task "${task.title}" moved from ${oldStatus} to ${moveTaskDto.status}`,
      userId: user.id,
      projectId: task.board.projectId,
      taskId: task.id,
      metadata: { from: oldStatus, to: moveTaskDto.status },
    });

    // Emit real-time task moved event
    this.websocketGateway.emitTaskMoved(task.boardId, {
      taskId: task.id,
      newStatus: moveTaskDto.status,
      newPosition: moveTaskDto.position,
    });

    return this.findOne(id, user);
  }

  async remove(id: string, user: User): Promise<void> {
    const task = await this.findOne(id, user);

    await this.activityService.create({
      type: ActivityType.TASK_DELETED,
      description: `Task "${task.title}" was deleted`,
      userId: user.id,
      projectId: task.board.projectId,
    });

    const boardId = task.boardId;
    const taskId = task.id;
    await this.tasksRepository.remove(task);

    // Emit real-time task deleted event
    this.websocketGateway.emitTaskDeleted(boardId, taskId);
  }

  async reorderTasks(
    boardId: string,
    status: TaskStatus,
    taskIds: string[],
    user: User,
  ): Promise<Task[]> {
    await this.boardsService.findOne(boardId, user);

    await Promise.all(
      taskIds.map((id, index) =>
        this.tasksRepository.update(id, { position: index }),
      ),
    );

    return this.findAllByBoard(boardId, user);
  }
}
