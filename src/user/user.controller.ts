import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @UseInterceptors(FileInterceptor('avatar'))
  async register(
    @Body() data: any,
    @UploadedFile() avatar?: Express.Multer.File,
  ): Promise<User> {
    const user = this.userService.create(avatar, data);
    return user;
  }
}
