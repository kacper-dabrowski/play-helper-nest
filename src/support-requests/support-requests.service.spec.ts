import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { fakeCreateSupportRequestDto } from './dto/create-support-request.dto';
import {
  fakeSupportRequestEntity,
  SupportRequest,
} from './entities/support-request.entity';
import { SupportRequestsService } from './support-requests.service';

const supportRequestsRepository = {
  create: jest.fn(() => fakeSupportRequestEntity),
  save: jest.fn(async () => fakeSupportRequestEntity),
  findOneBy: jest.fn(async () => fakeSupportRequestEntity),
  findAndCount: jest.fn(async () => [[fakeSupportRequestEntity], 1]),
};

describe('SupportRequestsService', () => {
  let service: SupportRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupportRequestsService,
        {
          useFactory: () => supportRequestsRepository,
          provide: getRepositoryToken(SupportRequest),
        },
      ],
    }).compile();

    service = module.get<SupportRequestsService>(SupportRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a support request from dto and return it', async () => {
    const result = await service.create(fakeCreateSupportRequestDto);

    expect(result).toEqual(fakeSupportRequestEntity);
    expect(supportRequestsRepository.save).toHaveBeenCalledWith(
      fakeSupportRequestEntity,
    );
  });

  it('should return paginated data', async () => {
    const result = await service.get(1, 5);

    expect(supportRequestsRepository.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 5,
    });
    expect(result).toEqual({
      hasNextPage: false,
      page: 1,
      supportRequests: [
        {
          content:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
          department: 'Technical department',
          description: 'Some description',
          id: 'some-id',
          title: 'My support request',
        },
      ],
      totalCount: 1,
    });
  });

  it('should calculate pagination correctly', async () => {
    supportRequestsRepository.findAndCount.mockResolvedValue([
      [fakeSupportRequestEntity],
      10,
    ]);

    const result = await service.get(2, 5);

    expect(supportRequestsRepository.findAndCount).toHaveBeenCalledWith({
      skip: 5,
      take: 5,
    });
    expect(result.hasNextPage).toEqual(false);
  });

  it('should return hasNextPage set to true, when there is another page available', async () => {
    supportRequestsRepository.findAndCount.mockResolvedValue([
      [fakeSupportRequestEntity],
      10,
    ]);

    const result = await service.get(1, 5);

    expect(supportRequestsRepository.findAndCount).toHaveBeenCalledWith({
      skip: 5,
      take: 5,
    });
    expect(result.hasNextPage).toEqual(true);
  });
});
