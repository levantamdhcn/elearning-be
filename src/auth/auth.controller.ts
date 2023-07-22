import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogoutDTO, SignInDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  siginIn(@Body() siginInDTO: SignInDTO) {
    return this.authService.siginIn(siginInDTO.email, siginInDTO.password);
  }

  @Post('logout')
  logout(@Body() logoutDTO: LogoutDTO) {
    return this.authService.logout(logoutDTO.userId);
  }

  @Post('refreshToken')
  refreshToken() {}
}
