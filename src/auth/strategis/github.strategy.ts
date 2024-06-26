import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly authsService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: process.env.GITHUB_APP_ID,
      clientSecret: process.env.GITHUB_APP_SECRET,
      callbackURL: `${configService.get<string>(
        'app.APP_HOST',
      )}api/auth/github/redirect`,
      scope: ['public_profile'],
      profileFields: ['id', 'emails', 'name', 'photos'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { avatar_url, login, id, name, email } = profile;
    const data = {
      facebookId: null,
      githubId: id,
      email: email,
      fullname: name,
      firstName: name,
      lastName: '',
      username: email,
      avatar: avatar_url,
      password: null,
    };

    const user = await this.authsService.findOrCreateGithubUser(data);
    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}
