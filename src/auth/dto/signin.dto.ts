import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignInDTO {
  @ApiProperty({
    required: true,
    example: 'demo@demo.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    example: 'password',
  })
  @IsNotEmpty()
  password: string;
}
