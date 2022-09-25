import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-42';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // Here a custom User object is returned. In the the repo I'm using a UsersService with repository pattern, learn more here: https://docs.nestjs.com/techniques/database
    return {
      user: {
        provider: '42',
        userId: profile.id,
        login42: profile.username,
        email: profile.emails[0].value,
      },
      authInfo: {
        accessToken,
        refreshToken,
      },
    };
  }
}
