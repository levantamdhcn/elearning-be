import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  siginIn(@Body() siginInDto: SignInDTO) {
    return this.authService.siginIn(siginInDto.email, siginInDto.password);
  }

  @Post('/logout')
  logout() {}

  @Post('/refreshToken')
  refreshToken() {}
}
