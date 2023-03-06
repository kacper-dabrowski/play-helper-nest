import { calculatePaginationParams, checkIfHasNextPage } from './pagination';

describe('PaginationService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return hasNextPage: true, when there is another page available', async () => {
    const result = calculatePaginationParams({ page: 1, perPage: 1 });

    expect(result).toEqual({ skip: 0, take: 1 });
  });

  it('should return hasNextPage: false, when there is no another page available', () => {
    const result = checkIfHasNextPage({ page: 1, perPage: 1, totalCount: 1 });

    expect(result).toEqual(false);
  });

  it('should return calculated options for given page', async () => {
    expect(calculatePaginationParams({ page: 2, perPage: 10 })).toEqual({
      skip: 10,
      take: 10,
    });
  });
});
