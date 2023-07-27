import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/users/users.service';
import { jwtConstants } from '../constants';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.atSecret,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne({ email: payload['email'] });

    // FIXME: not throwing exceptions
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
