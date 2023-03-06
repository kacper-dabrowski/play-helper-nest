import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { fakeCreateSolutionDto } from './dto/create-solution.dto';
import { fakeSolutionEntity } from './solution.entity.fake';
import { SolutionsService } from './solutions.service';

const prisma = {
  solution: {
    create: jest.fn(({ data }) => ({ ...data, id: 'some-id' })),
    count: jest.fn(async () => 1),
    findMany: jest.fn(async () => [fakeSolutionEntity]),
    delete: jest.fn(),
  },
};

describe('SupportRequestsService', () => {
  let service: SolutionsService;
  const userId = 'some-user-id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SolutionsService,
        {
          useFactory: () => prisma,
          provide: PrismaService,
        },
      ],
    }).compile();

    service = module.get<SolutionsService>(SolutionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a solution from dto, assign to a user and return it', async () => {
    const result = await service.create(fakeCreateSolutionDto, userId);

    expect(prisma.solution.create).toHaveBeenCalledWith({
      data: { ...fakeCreateSolutionDto, authorId: userId },
    });
    expect(result).toEqual(fakeSolutionEntity);
  });

  it('should return paginated data', async () => {
    const result = await service.getForUser({
      page: 1,
      perPage: 5,
      authorId: userId,
    });

    assertCorrectPaginationParams({ skip: 0, take: 5 });
    expect(result).toEqual({
      hasNextPage: false,
      page: 1,
      entities: [
        {
          id: 'some-id',
          content:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
          authorId: userId,
          description: 'Some description',
          title: 'My support request',
          isPublic: false,
        },
      ],
      totalCount: 1,
    });
  });

  it('should calculate pagination correctly', async () => {
    prisma.solution.count.mockResolvedValue(10);
    prisma.solution.findMany.mockResolvedValue([fakeSolutionEntity]);

    const result = await service.getForUser({
      page: 3,
      perPage: 5,
      authorId: userId,
    });

    assertCorrectPaginationParams({ skip: 10, take: 5 });
    expect(result.hasNextPage).toEqual(false);
  });

  it('should return hasNextPage set to true, when there is another page available', async () => {
    givenDocumentsCount(10);

    const result = await service.getForUser({
      page: 1,
      perPage: 5,
      authorId: userId,
    });

    assertCorrectPaginationParams({ skip: 0, take: 5 });
    expect(result.hasNextPage).toEqual(true);
  });
});

function givenDocumentsCount(count: number) {
  prisma.solution.findMany.mockResolvedValue(
    new Array(count).fill(fakeSolutionEntity),
  );
  prisma.solution.count.mockResolvedValue(count);
}

function assertCorrectPaginationParams({
  skip,
  take,
}: {
  skip: number;
  take: number;
}) {
  expect(prisma.solution.findMany).toHaveBeenCalledWith({
    skip,
    take,
    where: { OR: [{ isPublic: true }, { authorId: 'some-user-id' }] },
  });
  expect(prisma.solution.count).toHaveBeenCalled();
}
