import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDTO {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  refreshToken: string;
}
