import { Body, Controller, Get, Param, Req } from '@nestjs/common';
import { User } from '../user/schemas/user.schema';
import { AuthService } from './auth.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/initialization/:id')
  @ApiParam({ name: 'id', type: String })
  async initialization(@Param() params: any): Promise<User> {
    const user = await this.authService.initialization(params.id);
    return user;
  }
}
