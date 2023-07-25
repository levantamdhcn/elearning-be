import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LogoutDTO {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  _id: string;
}
