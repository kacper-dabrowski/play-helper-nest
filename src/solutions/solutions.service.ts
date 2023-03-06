import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  calculatePaginationParams,
  checkIfHasNextPage,
} from '../pagination/pagination';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';

@Injectable()
export class SolutionsService {
  constructor(private prisma: PrismaService) {}

  async getForUser({
    page,
    perPage,
    authorId,
  }: {
    page: number;
    perPage: number;
    authorId: string;
  }) {
    const paginationParams = calculatePaginationParams({ page, perPage });

    const query = {
      where: { OR: [{ isPublic: true }, { authorId }] },
    };

    const [totalCount, entities] = await Promise.all([
      this.prisma.solution.count(),
      this.prisma.solution.findMany({ ...query, ...paginationParams }),
    ]);

    const hasNextPage = checkIfHasNextPage({ page, perPage, totalCount });

    return {
      entities,
      hasNextPage,
      totalCount,
      page,
    };
  }

  async create(createSolutionDto: CreateSolutionDto, authorId: string) {
    return this.prisma.solution.create({
      data: { ...createSolutionDto, authorId },
    });
  }

  async update(id: string, updateSolutionDto: UpdateSolutionDto) {
    return this.prisma.solution.update({
      where: { id },
      data: updateSolutionDto,
    });
  }

  async remove(id: string) {
    return this.prisma.solution.delete({ where: { id } });
  }
}
