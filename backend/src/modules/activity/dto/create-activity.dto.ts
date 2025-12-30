import { IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { ActivityType } from '../../../common/enums';

export class CreateActivityDto {
  @IsEnum(ActivityType)
  type: ActivityType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  userId: string;

  @IsUUID()
  projectId: string;

  @IsOptional()
  @IsUUID()
  taskId?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
