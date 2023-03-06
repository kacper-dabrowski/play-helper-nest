import { PaginationService } from './pagination.service';

const fakeEntity = { count: jest.fn(), findMany: jest.fn() };

describe('PaginationService', () => {
  let service: PaginationService<typeof fakeEntity>;

  beforeEach(() => {
    service = new PaginationService(fakeEntity);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return hasNextPage: true, when there is another page available', async () => {
    fakeEntity.count.mockResolvedValue(2);

    const result = await service.getPaginatedEntries({ page: 1, perPage: 1 });

    expect(result).toMatchObject({ hasNextPage: true });
  });

  it('should return hasNextPage: false, when there is no another page available', async () => {
    fakeEntity.count.mockResolvedValue(1);

    const result = await service.getPaginatedEntries({ page: 1, perPage: 1 });

    expect(result.hasNextPage).toEqual(false);
  });

  it('should fetch the first page by default with perPage = 15', async () => {
    fakeEntity.count.mockResolvedValue(1);

    await service.getPaginatedEntries();

    expect(fakeEntity.findMany).toHaveBeenCalledWith({ skip: 0, take: 15 });
  });
  it('should return total count', async () => {
    fakeEntity.count.mockResolvedValue(2137);

    const result = await service.getPaginatedEntries({ perPage: 1 });

    expect(result.totalCount).toEqual(2137);
  });

  it('should return entities', async () => {
    fakeEntity.findMany.mockResolvedValue([{ entity: 1 }, { entity: 2 }]);

    const result = await service.getPaginatedEntries({ page: 1, perPage: 1 });

    expect(result.entities).toEqual([{ entity: 1 }, { entity: 2 }]);
  });
});
