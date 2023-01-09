import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DefaultUserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [DefaultUserService],
  exports: [DefaultUserService],
})
export class UsersModule {}
