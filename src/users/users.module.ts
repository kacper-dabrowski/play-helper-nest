import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { PrismaService } from '../database/prisma.service';
import { DefaultUserService } from './users.service';

@Module({
  imports: [PrismaModule],
  providers: [DefaultUserService, PrismaService],
  exports: [DefaultUserService],
})
export class UsersModule {}
