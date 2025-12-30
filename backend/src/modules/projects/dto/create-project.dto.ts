import { IsString, IsOptional, MaxLength, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'E-Commerce Platform' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Building a modern e-commerce platform', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: 'ECOM' })
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  @Matches(/^[A-Z0-9]+$/, { message: 'Key must be uppercase alphanumeric' })
  key: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icon?: string;
}
