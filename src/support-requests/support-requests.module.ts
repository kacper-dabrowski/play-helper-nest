import { Module } from '@nestjs/common';
import { SupportRequestsService } from './support-requests.service';
import { SupportRequestsController } from './support-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportRequest } from './entities/support-request.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([SupportRequest]), AuthModule],
  controllers: [SupportRequestsController],
  providers: [SupportRequestsService],
})
export class SupportRequestsModule {}
