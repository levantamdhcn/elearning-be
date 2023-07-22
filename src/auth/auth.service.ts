import { ForbiddenException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from 'src/users/users.service';
import { jwtConstants } from './constants';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    // https://docs.nestjs.com/fundamentals/circular-dependency#forward-reference
    @Inject(forwardRef(() => UserService))
    private userService: UserService, 
    private jwtService: JwtService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 12);
  }

  async updateRefreshTokenHash(_id: string, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.userService.update(_id, {
      refreshToken: hash,
    })
  }

  async generateTokens(_id: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({
        sub: _id,
        email,
      }, {
        secret: jwtConstants.atSecret,
        expiresIn: 60 * 15, //15 minutes
      }),
      this.jwtService.signAsync({
        sub: _id,
        email,
      }, {
        secret: jwtConstants.rfSecret,
        expiresIn: 60 * 60 * 24 * 7, //7 days
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }

  async refreshToken(_id: string, refreshToken: string) {
    const user = await this.userService.findOne({ _id });
    if(!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);

    if(!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.generateTokens(_id, user.email);
    await this.updateRefreshTokenHash(user._id, tokens.refresh_token);
    return tokens;
  }

  async siginIn(email: string, pass: string): Promise<Tokens> {
    const user = await this.userService.findOne({ email });
    if (!this.isMatch(pass, user.password)) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(user._id, email);
    await this.updateRefreshTokenHash(user._id, tokens.refresh_token); 
    return tokens;
  }

  async logout(userId: string) {
    return this.userService.update(userId, { refreshToken: null });
  }

  async isMatch(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
