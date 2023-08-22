import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FacebookLoginDTO {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  accessToken: string;

  @IsNotEmpty()
  userID: string;
}
