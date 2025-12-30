import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'This looks great! Just a small suggestion...' })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content: string;

  @ApiProperty()
  @IsUUID()
  taskId: string;
}
