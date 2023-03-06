import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { DefaultUserService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { DefaultAuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  providers: [
    DefaultAuthService,
    LocalStrategy,
    JwtStrategy,
    ConfigService,
    DefaultUserService,
  ],
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: Number(configService.getOrThrow('JWT_EXPIRES_IN_MS')),
        },
      }),
    }),
  ],
})
export class AuthModule {}
