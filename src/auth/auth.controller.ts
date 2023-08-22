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
import {
  ChangePasswordDTO,
  LogoutDTO,
  RefreshTokenDTO,
  SignInDTO,
} from './dto';
import { AuthGuard } from './guards/auth.guard';
import { Tokens } from './types';
import { ApiTags, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDTO } from './dto/register.dto';
import { FacebookGuard, GithubGuard } from './guards';
import { FacebookLoginDTO } from './dto/facebook-login.dto';
import { GoogleLoginDTO } from './dto/google-login.dto';

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
  @UseInterceptors(FileInterceptor('avatar'))
  async register(
    @Body() data: any,
    @UploadedFile() avatar?: Express.Multer.File,
  ): Promise<Tokens> {
    const user = await this.authService.register(data, avatar);
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

  @Post('facebook')
  async facebookLogin(@Body() data: FacebookLoginDTO): Promise<any> {
    return this.authService.facebookLogin(data);
  }

  @Get('facebook/redirect')
  @UseGuards(FacebookGuard)
  async facebookLoginRedirect(@Req() req): Promise<any> {
    return req.user;
  }

  @Post('google')
  async githubLogin(@Body() data: GoogleLoginDTO): Promise<any> {
    return this.authService.googleLogin(data);
  }

  @HttpCode(HttpStatus.OK)
  @Get('github/redirect')
  @UseGuards(GithubGuard)
  async githubLoginRedirect(@Req() req): Promise<any> {
    return req.user;
  }

  // TODO: Forgot password

  // TODO: Change password
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Req() req,
    @Body() changePasswordDTO: ChangePasswordDTO,
  ) {
    return this.authService.changePassword(
      req.user.id,
      changePasswordDTO.newPassword,
    );
  }
}
