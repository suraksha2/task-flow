import { IsString, IsOptional, MaxLength, MinLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDto {
  @ApiProperty({ example: 'Sprint 1' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'First sprint of the project', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty()
  @IsUUID()
  projectId: string;
}
