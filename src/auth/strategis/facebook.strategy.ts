import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/facebook/redirect',
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
    const user = {
      email: emails?.[0]?.value,
      firstName: name.givenName,
      lastName: `${name.familyName} ${name.middleName}`,
      avatar: photos?.[0]?.value,
      facebookId: id,
    };
    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}
