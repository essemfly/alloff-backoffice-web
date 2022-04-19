import { convertToOffset, convertToPage } from "./paginate";

describe("convert offset/limit to page/size", () => {
  const page = 1;
  const pageSize = 10;

  test(`when page is ${page}, and page size is ${pageSize}`, () => {
    const { offset, limit } = convertToOffset({ page, pageSize });
    expect(limit).toBe(pageSize);
    expect(offset).toBe(0);
  });
});

describe("convert page/size to offset/limit", () => {
  const offset = 10;
  const limit = 10;

  test(`when offset is ${offset}, and limit is ${limit}`, () => {
    const { page, pageSize } = convertToPage({ offset, limit });
    expect(pageSize).toBe(limit);
    expect(page).toBe(2);
  });
});

export {}; // silence TS1208 error
