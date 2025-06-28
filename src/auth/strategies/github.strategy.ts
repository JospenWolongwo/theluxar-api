import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../services/auth.service';
import { AccountPayload } from '../interfaces/auth.interface';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    });
  }

  private readonly logger = new Logger(GithubStrategy.name);

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<string> {
    const { emails, username, photos } = profile;

    // Validate required fields
    if (!username) {
      this.logger.error('GitHub profile is missing the username');
      throw new BadRequestException('GitHub profile is missing required data');
    }

    // Use a fallback email if the email is private
    const email = emails[0]?.value || `${username}@github.com`;

    const accountPayload: AccountPayload = {
      email,
      firstName: username,
      lastName: '',
      picture: photos[0]?.value || '',
    };

    try {
      const userId = await this.authService.registerFromAccount(accountPayload);
      return userId;
    } catch (error) {
      this.logger.error(`GitHub OAuth error: ${JSON.stringify(error)}`);
      throw new InternalServerErrorException('GitHub authentication failed');
    }
  }
}
