import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, NotContains, Length, Matches } from 'class-validator';

export class RegisterDTO {
  @ApiProperty({
    required: true,
    example: 'Minhbt',
  })
  @IsNotEmpty()
  @Length(6, 30)
  fullname: string;

  @ApiProperty({
    required: true,
    example: 'minhbt2001',
  })
  @IsNotEmpty()
  @Matches(/^[a-z0-9_.-]{6,40}$/, {
    message:
      "Username can only contain lowercase letters, numbers, '_', '-' and '.' with min 6 max 40 length",
  })
  username: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  avatar: any;

  @ApiProperty({
    required: true,
    example: 'demo@demo.com',
  })
  @Matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
    message: 'Email must be a type of email',
  })
  @Length(6, 50)
  email: string;

  @ApiProperty({
    required: true,
    example: 'password',
  })
  @IsNotEmpty()
  @NotContains(' ')
  @Length(6, 20)
  password: string;
}
