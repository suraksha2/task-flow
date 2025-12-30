import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('api/projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user: User) {
    return this.projectsService.create(createProjectDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects for current user' })
  findAll(@CurrentUser() user: User) {
    return this.projectsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.projectsService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project' })
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.update(id, updateProjectDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.projectsService.remove(id, user);
  }

  @Post(':id/members/:memberId')
  @ApiOperation({ summary: 'Add member to project' })
  addMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.addMember(id, memberId, user);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Remove member from project' })
  removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.removeMember(id, memberId, user);
  }
}
