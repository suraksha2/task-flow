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
import { BoardsService } from './boards.service';
import { CreateBoardDto, UpdateBoardDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Boards')
@ApiBearerAuth()
@Controller('api/boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new board' })
  create(@Body() createBoardDto: CreateBoardDto, @CurrentUser() user: User) {
    return this.boardsService.create(createBoardDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all boards for a project' })
  findAll(@Query('projectId') projectId: string, @CurrentUser() user: User) {
    return this.boardsService.findAllByProject(projectId, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get board by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.boardsService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update board' })
  update(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @CurrentUser() user: User,
  ) {
    return this.boardsService.update(id, updateBoardDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete board' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.boardsService.remove(id, user);
  }

  @Post('reorder')
  @ApiOperation({ summary: 'Reorder boards' })
  reorder(
    @Body() body: { projectId: string; boardIds: string[] },
    @CurrentUser() user: User,
  ) {
    return this.boardsService.reorder(body.projectId, body.boardIds, user);
  }
}
