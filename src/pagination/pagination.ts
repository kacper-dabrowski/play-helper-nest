export const calculatePaginationParams = ({
  page,
  perPage,
}: {
  page: number;
  perPage: number;
}) => ({
  skip: (page - 1) * perPage,
  take: perPage,
});

export const checkIfHasNextPage = ({
  page,
  perPage,
  totalCount,
}: {
  page: number;
  perPage: number;
  totalCount: number;
}) => totalCount >= page * perPage + 1;
