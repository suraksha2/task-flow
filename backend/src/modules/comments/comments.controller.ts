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
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller('api/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  create(@Body() createCommentDto: CreateCommentDto, @CurrentUser() user: User) {
    return this.commentsService.create(createCommentDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments for a task' })
  findAll(@Query('taskId') taskId: string, @CurrentUser() user: User) {
    return this.commentsService.findAllByTask(taskId, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.commentsService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update comment' })
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.update(id, updateCommentDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete comment' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.commentsService.remove(id, user);
  }
}
