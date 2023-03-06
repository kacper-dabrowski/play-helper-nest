import { Module } from '@nestjs/common';
import { SolutionsService } from './solutions.service';
import { SolutionsController } from './solutions.controller';
import { PrismaModule } from '../database/prisma.module';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [SolutionsController],
  providers: [SolutionsService, PrismaService],
})
export class SolutionsModule {}
