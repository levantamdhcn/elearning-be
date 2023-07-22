import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { Tokens } from 'src/auth/types';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @UseInterceptors(FileInterceptor('avatar'))
  async register(
    @Body() data: any,
    @UploadedFile() avatar?: Express.Multer.File,
  ): Promise<Tokens> {
    const user = await this.userService.create(avatar, data);
    return user;
  }
}
