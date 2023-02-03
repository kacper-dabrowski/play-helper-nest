import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
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
    const paginationParams = this.calculatePaginationParams(page, perPage);

    const [totalCount, result] = await Promise.all([
      this.prisma.supportRequest.count(paginationParams),
      this.prisma.supportRequest.findMany(paginationParams),
    ]);

    const hasNextPage = totalCount > page * perPage + 1;

    return {
      supportRequests: result,
      hasNextPage,
      page,
      totalCount,
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

  private calculatePaginationParams(page: number, perPage: number) {
    return { take: perPage, skip: (page - 1) * perPage };
  }
}
