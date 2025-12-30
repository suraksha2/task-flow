import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  IsUUID,
  IsEnum,
  IsDateString,
  IsNumber,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../../../common/enums';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement user authentication' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Add JWT-based authentication with refresh tokens', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty()
  @IsUUID()
  boardId: string;

  @ApiProperty({ enum: TaskStatus, required: false })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ enum: TaskPriority, required: false })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  estimatedHours?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];
}
