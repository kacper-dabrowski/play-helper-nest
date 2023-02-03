import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash as bcryptHash } from 'bcrypt';
import { PrismaService } from '../database/prisma.service';
import { UserService } from './service';

@Injectable()
export class DefaultUserService implements UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    const { password, ...restOfUser } = createUserDto;

    const hashedPassword = await bcryptHash(password, 8);

    return this.prisma.user.create({
      data: { ...restOfUser, password: hashedPassword },
    });
  }

  findByUsername({ username }: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({ where: { username } });
  }
}
