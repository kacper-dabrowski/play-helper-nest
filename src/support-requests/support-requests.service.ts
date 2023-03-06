import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  calculatePaginationParams,
  checkIfHasNextPage,
} from '../pagination/pagination';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { UpdateSupportRequestDto } from './dto/update-support-request.dto';

@Injectable()
export class SupportRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(createSupportRequestDto: CreateSupportRequestDto) {
    return this.prisma.supportRequest.create({
      data: { ...createSupportRequestDto },
    });
  }

  async get(page: number, perPage: number) {
    const paginationParams = calculatePaginationParams({ page, perPage });

    const [totalCount, entities] = await Promise.all([
      this.prisma.supportRequest.count(),
      this.prisma.supportRequest.findMany(paginationParams),
    ]);

    const hasNextPage = checkIfHasNextPage({ page, perPage, totalCount });

    return {
      totalCount,
      entities,
      hasNextPage,
      page,
    };
  }

  async update(id: string, updateSupportRequestDto: UpdateSupportRequestDto) {
    return this.prisma.supportRequest.update({
      where: { id },
      data: updateSupportRequestDto,
    });
  }

  async remove(id: string) {
    return this.prisma.supportRequest.delete({ where: { id } });
  }
}
