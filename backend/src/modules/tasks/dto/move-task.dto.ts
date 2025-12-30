import { IsUUID, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../../common/enums';

export class MoveTaskDto {
  @ApiProperty()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty()
  @IsNumber()
  position: number;
}
