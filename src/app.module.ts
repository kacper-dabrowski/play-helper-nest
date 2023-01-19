import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

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
          entities: [User],
          synchronize: true,
          useUnifiedTopology: true,
          dropSchema: configService.get('NODE_ENV') === 'test' ? true : false,
        };
      },
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
