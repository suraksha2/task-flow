import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { CreateBoardDto, UpdateBoardDto } from './dto';
import { User } from '../users/entities/user.entity';
import { ProjectsService } from '../projects/projects.service';
import { ActivityService } from '../activity/activity.service';
import { ActivityType } from '../../common/enums';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardsRepository: Repository<Board>,
    private projectsService: ProjectsService,
    private activityService: ActivityService,
  ) {}

  async create(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
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
      type: ActivityType.BOARD_CREATED,
      description: `Board "${board.name}" was created`,
      userId: user.id,
      projectId: project.id,
    });

    return savedBoard;
  }

  async findAllByProject(projectId: string, user: User): Promise<Board[]> {
    await this.projectsService.findOne(projectId, user);

    return this.boardsRepository.find({
      where: { projectId },
      relations: ['tasks', 'tasks.assignee'],
      order: { position: 'ASC' },
    });
  }

  async findOne(id: string, user: User): Promise<Board> {
    const board = await this.boardsRepository.findOne({
      where: { id },
      relations: ['project', 'tasks', 'tasks.assignee', 'tasks.reporter'],
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    await this.projectsService.findOne(board.projectId, user);

    return board;
  }

  async update(id: string, updateBoardDto: UpdateBoardDto, user: User): Promise<Board> {
    const board = await this.findOne(id, user);

    Object.assign(board, updateBoardDto);
    const updatedBoard = await this.boardsRepository.save(board);

    await this.activityService.create({
      type: ActivityType.BOARD_UPDATED,
      description: `Board "${board.name}" was updated`,
      userId: user.id,
      projectId: board.projectId,
    });

    return updatedBoard;
  }

  async remove(id: string, user: User): Promise<void> {
    const board = await this.findOne(id, user);
    await this.boardsRepository.remove(board);
  }

  async reorder(projectId: string, boardIds: string[], user: User): Promise<Board[]> {
    await this.projectsService.findOne(projectId, user);

    await Promise.all(
      boardIds.map((id, index) =>
        this.boardsRepository.update(id, { position: index }),
      ),
    );

    return this.findAllByProject(projectId, user);
  }
}
