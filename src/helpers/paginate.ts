export type OffsetNLimit = {
  offset: number;
  limit: number;
};

export type PageNPageSize = {
  page: number;
  pageSize: number;
};

export const convertToOffset = ({
  page,
  pageSize,
}: PageNPageSize): OffsetNLimit => {
  return { offset: (page - 1) * pageSize, limit: pageSize };
};

export const convertToPage = ({
  offset,
  limit,
}: OffsetNLimit): PageNPageSize => {
  return { page: (offset + limit) / limit, pageSize: limit };
};
