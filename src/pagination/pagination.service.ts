export interface Pageable<T> {
  count(): Promise<number>;
  findMany(params: object & PaginationParams): Promise<T[]>;
}

interface PaginationParams {
  take: number;
  skip: number;
}

export class PaginationService<T> {
  constructor(private pageableEntity: Pageable<T>) {}

  async getPaginatedEntries({
    page = 1,
    perPage = 15,
  }: {
    page?: number;
    perPage?: number;
  } = {}) {
    const paginationParams = this.calculatePaginationParams(page, perPage);

    const [totalCount, entities] = await Promise.all([
      this.pageableEntity.count(),
      this.pageableEntity.findMany(paginationParams),
    ]);

    const hasNextPage = this.hasNextPage({ totalCount, page, perPage });

    return {
      entities,
      hasNextPage,
      totalCount,
      page,
    };
  }

  private calculatePaginationParams = (
    page: number,
    perPage: number,
  ): PaginationParams => ({ take: perPage, skip: (page - 1) * perPage });

  private hasNextPage({
    totalCount,
    page,
    perPage,
  }: {
    totalCount: number;
    page: number;
    perPage: number;
  }) {
    const countWithExtraDocumentWanted = page * perPage + 1;

    return totalCount >= countWithExtraDocumentWanted;
  }
}
