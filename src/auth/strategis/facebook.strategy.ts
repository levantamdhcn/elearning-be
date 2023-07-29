import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { UserService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly authsService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${configService.get<string>(
        'app.APP_HOST',
      )}/api/auth/facebook/redirect`,
      profileFields: ['id', 'emails', 'name', 'photos'],
      scope: 'email'
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const data = {
      username: emails?.[0]?.value,
      fullname: `${name.familyName} ${name.middleName} ${name.givenName}`,
      email: emails?.[0]?.value,
      firstName: name.givenName,
      lastName: `${name.familyName} ${name.middleName}`,
      avatar: photos?.[0]?.value,
      facebookId: id,
      githubId: null,
      password: null,
    };

    const user = await this.authsService.findOrCreateFacebookUser(data);
    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}
