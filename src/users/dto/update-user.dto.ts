import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { RegisterDto } from 'src/auth/dto/register.dto';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(10)
  password?: string;
}
