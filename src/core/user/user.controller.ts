import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('Users')
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
