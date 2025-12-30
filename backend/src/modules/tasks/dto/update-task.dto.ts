import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(OmitType(CreateTaskDto, ['boardId'])) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  loggedHours?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  position?: number;
}
