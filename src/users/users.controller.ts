import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { UserService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto';

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
  updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }
}
