import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  getAll(@Query('search') search: string) {
    return this.userService.getUsers(search);
  }

  @Get('/:id')
  findByUsername(@Param('id') id: any) {
    return this.userService.findOne({ _id: id });
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('avatar'))
  updateUser(
    @Param('id') id: string,
    @Body() data: any,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    return this.userService.update(id, data, avatar);
  }
}
