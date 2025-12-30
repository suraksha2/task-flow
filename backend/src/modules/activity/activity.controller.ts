import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Activity')
@ApiBearerAuth()
@Controller('api/activity')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('project')
  @ApiOperation({ summary: 'Get activity log for a project' })
  findByProject(@Query('projectId') projectId: string, @Query('limit') limit?: number) {
    return this.activityService.findByProject(projectId, limit);
  }

  @Get('task')
  @ApiOperation({ summary: 'Get activity log for a task' })
  findByTask(@Query('taskId') taskId: string, @Query('limit') limit?: number) {
    return this.activityService.findByTask(taskId, limit);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user activity' })
  findMyActivity(@CurrentUser() user: User, @Query('limit') limit?: number) {
    return this.activityService.findByUser(user.id, limit);
  }
}
