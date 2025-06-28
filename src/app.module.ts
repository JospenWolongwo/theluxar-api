import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { databaseConfig, pinoConfig, redisConfig } from './common/config';
import { User } from './user/entities/user.entity';
import { Auth } from './auth/entities/auth.entity';
import { EmailModule } from './email/email.module';
import { UserPermissionsModule } from './user-permission/user-permission.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      ...databaseConfig(),
      entities: [Auth, User],
    }),
    TypeOrmModule.forFeature([User, Auth]),
    CacheModule.registerAsync(redisConfig()),
    LoggerModule.forRoot(pinoConfig()),
    AuthModule,
    UserModule,
    EmailModule,
    UserPermissionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
