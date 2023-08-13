import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GoogleLoginDTO {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  tokenId: string;
}
