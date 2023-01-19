import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { UpdateSupportRequestDto } from './dto/update-support-request.dto';
import { SupportRequest } from './entities/support-request.entity';

@Injectable()
export class SupportRequestsService {
  constructor(
    @InjectRepository(SupportRequest)
    private supportRequestRepository: Repository<SupportRequest>,
  ) {}

  async create(createSupportRequestDto: CreateSupportRequestDto) {
    const srqToCreate = this.supportRequestRepository.create(
      createSupportRequestDto,
    );

    await this.supportRequestRepository.save(srqToCreate);

    return srqToCreate;
  }

  async get(page: number, perPage: number) {
    const [result, totalCount] =
      await this.supportRequestRepository.findAndCount({
        take: perPage,
        skip: (page - 1) * perPage,
      });

    return {
      supportRequests: result,
      hasNextPage: totalCount > page * perPage + 1,
      page,
      totalCount,
    };
  }

  async update(id: string, updateSupportRequestDto: UpdateSupportRequestDto) {
    return this.supportRequestRepository.save({
      id,
      ...updateSupportRequestDto,
    });
  }

  async remove(id: string) {
    const srqToRemove = await this.supportRequestRepository.findOneBy({ id });

    return this.supportRequestRepository.remove(srqToRemove);
  }
}
