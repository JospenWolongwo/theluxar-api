import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import { UserPermissionsService } from '../../user-permission/services/user-permissions.service';
import type { AccountInfo, TokenPayload } from '../types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
) {
  constructor(
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userPermissionsService: UserPermissionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  private readonly logger = new Logger(AccessTokenStrategy.name);

  async validate(payload: TokenPayload) {
    try {
      // Get account information from cache
      const storedAccountInfo = <AccountInfo>(
        await this.cacheManager.get(payload.sub)
      );

      if (storedAccountInfo?.uid) {
        return storedAccountInfo; // Return cached account info
      }

      // Fetch account information from the database
      const account = await this.authService.findByUserId(payload.sub);

      if (account?.id) {
        // Fetch user permissions
        const userPermissions =
          await this.userPermissionsService.getUserPermissions(account.user.id);

        const accountInfo = <AccountInfo>{
          uid: account.user.id,
          createdAt: account.createdAt,
          lastLogin: account.lastLogin,
          permissions: userPermissions?.permissions || [],
          // Add roles property that maps directly from permissions for RolesGuard
          roles: userPermissions?.permissions || [],
        };

        // Cache the account information
        const expiration = payload.exp * 1000 - new Date().getTime();
        await this.cacheManager.set(payload.sub, accountInfo, expiration);

        return accountInfo;
      }

      this.logger.error(
        { [this.validate.name]: { input: { payload } } },
        'Account with user_id: `%s` from payload does not exist',
        payload.sub,
      );

      throw new BadRequestException();
    } catch (error) {
      this.logger.error({
        message: `An error occurred when trying to get user's information. Thrown Error : {${JSON.stringify(error)}}`,
        context: { input: { payload }, error: error },
      });

      throw new UnauthorizedException('Unauthorized access');
    }
  }
}
