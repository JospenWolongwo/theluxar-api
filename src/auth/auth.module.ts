import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { EmailModule } from '../email/email.module';
import { UserPermissionsModule } from '../user-permission/user-permission.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { Auth } from './entities/auth.entity';
import { googleRecaptchaConfig } from '../common/config';
import { LocalStrategy } from './strategies/local.strategy';
import { User } from '../user/entities/user.entity';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    EmailModule,
    UserPermissionsModule,
    GoogleRecaptchaModule.forRoot(googleRecaptchaConfig()),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    GithubStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
