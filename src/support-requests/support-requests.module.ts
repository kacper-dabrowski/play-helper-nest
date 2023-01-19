import { Module } from '@nestjs/common';
import { SupportRequestsService } from './support-requests.service';
import { SupportRequestsController } from './support-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportRequest } from './entities/support-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupportRequest])],
  controllers: [SupportRequestsController],
  providers: [SupportRequestsService],
})
export class SupportRequestsModule {}
