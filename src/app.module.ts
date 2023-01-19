import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { SupportRequestsModule } from './support-requests/support-requests.module';
import { SupportRequest } from './support-requests/entities/support-request.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mongodb',
          url: configService.getOrThrow('DB_CONNECTION_STRING'),
          entities: [User, SupportRequest],
          synchronize: true,
          useUnifiedTopology: true,
        };
      },
    }),
    UsersModule,
    AuthModule,
    SupportRequestsModule,
  ],
  providers: [AppService],
})
export class AppModule {}
