import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SolutionsModule } from './solutions/solutions.module';
import { SupportRequestsModule } from './support-requests/support-requests.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    SupportRequestsModule,
    SolutionsModule,
  ],
  providers: [AppService],
})
export class AppModule {}
