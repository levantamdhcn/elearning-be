import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async siginIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne({ email });
    if (!this.isMatch(pass, user.password)) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user._id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async isMatch(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
