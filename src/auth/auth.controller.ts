import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/shared/decorator/public.decorator';
import { User } from 'src/users/schemas/users.schema';
import { AuthService } from './auth.service';
import { LogoutDTO, RefreshTokenDTO, SignInDTO } from './dto';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';
import { AuthGuard } from './guards/auth.guard';
import { Tokens } from './types';
import { ApiTags, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDTO } from './dto/register.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('currentUser')
  async getCurrentUser(@Req() req): Promise<User> {
    return req.user;
  }

  @Post('register')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  async register(
    @Body() data: RegisterDTO,
    @UploadedFile() avatar?: Express.Multer.File,
  ): Promise<Tokens> {
    const user = await this.authService.register(avatar, data);
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  siginIn(@Body() siginInDTO: SignInDTO) {
    return this.authService.siginIn(siginInDTO.email, siginInDTO.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Body() logoutDTO: LogoutDTO) {
    return this.authService.logout(logoutDTO._id);
  }

  @Public()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refreshToken')
  refreshToken(@Body() refreshTokenDTO: RefreshTokenDTO) {
    return this.authService.refreshToken(
      refreshTokenDTO._id,
      refreshTokenDTO.refreshToken,
    );
  }
}
