import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, MoveTaskDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { TaskStatus } from '../../common/enums';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('api/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for a board' })
  findAll(@Query('boardId') boardId: string, @CurrentUser() user: User) {
    return this.tasksService.findAllByBoard(boardId, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Patch(':id/move')
  @ApiOperation({ summary: 'Move task (drag & drop)' })
  move(
    @Param('id') id: string,
    @Body() moveTaskDto: MoveTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.move(id, moveTaskDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.remove(id, user);
  }

  @Post('reorder')
  @ApiOperation({ summary: 'Reorder tasks within a status column' })
  reorder(
    @Body() body: { boardId: string; status: TaskStatus; taskIds: string[] },
    @CurrentUser() user: User,
  ) {
    return this.tasksService.reorderTasks(body.boardId, body.status, body.taskIds, user);
  }
}
