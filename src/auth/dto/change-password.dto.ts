import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDTO {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(5)
  @ApiProperty({
    required: true,
    example: 'password',
  })
  @IsNotEmpty()
  newPassword: string;
}
