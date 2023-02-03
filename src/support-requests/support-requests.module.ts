import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { PrismaService } from '../database/prisma.service';
import { SupportRequestsController } from './support-requests.controller';
import { SupportRequestsService } from './support-requests.service';

@Module({
  imports: [PrismaModule],
  controllers: [SupportRequestsController],
  providers: [SupportRequestsService, PrismaService],
})
export class SupportRequestsModule {}
