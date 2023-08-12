import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/username/:username')
  findByUsername(@Param() username: string) {
    return this.userService.findOne({ username });
  }
}
