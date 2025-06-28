import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../services/auth.service';
import { AccountPayload } from '../interfaces/auth.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  private readonly logger = new Logger(GoogleStrategy.name);

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<string> {
    const { emails, name, photos } = profile;

    // Validate required fields
    if (!emails || !emails[0]?.value) {
      this.logger.error('Google profile is missing the email');
      throw new BadRequestException('Email is required for registration');
    }

    if (!name?.givenName) {
      this.logger.error('Google profile is missing the first name');
      throw new BadRequestException('First name is required for registration');
    }

    const accountPayload: AccountPayload = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName || '',
      picture: photos[0]?.value || '',
    };

    try {
      const userId = await this.authService.registerFromAccount(accountPayload);
      return userId;
    } catch (error) {
      this.logger.error(`Google OAuth error: ${JSON.stringify(error)}`);
      throw new InternalServerErrorException('Google authentication failed');
    }
  }
}
