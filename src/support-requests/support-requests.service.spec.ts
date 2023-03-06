import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { fakeCreateSupportRequestDto } from './dto/create-support-request.dto';
import { fakeSupportRequestEntity } from './support-request.entity.fake';
import { SupportRequestsService } from './support-requests.service';

const prisma = {
  supportRequest: {
    create: jest.fn(({ data }) => ({ ...data, id: 'some-id' })),
    count: jest.fn(async () => 1),
    findMany: jest.fn(async () => [fakeSupportRequestEntity]),
    delete: jest.fn(),
  },
};

describe('SupportRequestsService', () => {
  let service: SupportRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupportRequestsService,
        {
          useFactory: () => prisma,
          provide: PrismaService,
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
    expect(prisma.supportRequest.create).toHaveBeenCalledWith({
      data: fakeCreateSupportRequestDto,
    });
  });

  it('should return paginated data', async () => {
    const result = await service.get(1, 5);

    assertCorrectPaginationParams({ skip: 0, take: 5 });
    expect(result).toEqual({
      hasNextPage: false,
      page: 1,
      entities: [
        {
          id: 'some-id',
          content:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
          department: 'Technical department',
          description: 'Some description',
          title: 'My support request',
        },
      ],
      totalCount: 1,
    });
  });

  it('should calculate pagination correctly', async () => {
    prisma.supportRequest.count.mockResolvedValue(10);
    prisma.supportRequest.findMany.mockResolvedValue([
      fakeSupportRequestEntity,
    ]);

    const result = await service.get(3, 5);

    assertCorrectPaginationParams({ skip: 10, take: 5 });
    expect(result.hasNextPage).toEqual(false);
  });

  it('should return hasNextPage set to true, when there is another page available', async () => {
    givenDocumentsCount(10);

    const result = await service.get(1, 5);

    assertCorrectPaginationParams({ skip: 0, take: 5 });
    expect(result.hasNextPage).toEqual(true);
  });
});

function givenDocumentsCount(count: number) {
  prisma.supportRequest.findMany.mockResolvedValue(
    new Array(count).fill(fakeSupportRequestEntity),
  );
  prisma.supportRequest.count.mockResolvedValue(count);
}

function assertCorrectPaginationParams({
  skip,
  take,
}: {
  skip: number;
  take: number;
}) {
  expect(prisma.supportRequest.findMany).toHaveBeenCalledWith({
    skip,
    take,
  });
  expect(prisma.supportRequest.count).toHaveBeenCalled();
}
