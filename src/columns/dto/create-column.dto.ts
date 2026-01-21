import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, MinLength, Min } from 'class-validator';

export class CreateColumnDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  position: number;
}
