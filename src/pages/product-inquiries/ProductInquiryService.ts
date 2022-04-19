import {
  ProductInquiry as ProductInquiryDto,
  InquiriesApiInquiriesListRequest as ListRequest,
  InquiriesApi,
} from "@lessbutter/alloff-backoffice-api";
import { DateTime } from "luxon";

import Service from "@app/lib/Service";

export type ProductInquiry = ProductInquiryDto & { id: string };

export type SearchQueryParam = Omit<ListRequest, "isPending"> & {
  totalCount: number;
  isPending?: string | undefined;
};

export default class ProductInquiryService extends Service<ProductInquiry> {
  private productInquiryApi: InquiriesApi;

  private searchFilter: SearchQueryParam = {
    // offset: 0,
    // limit: 50,
    dateFrom: DateTime.now().minus({ days: 7 }).toISO().split("T")[0],
    dateTo: DateTime.now().toISO().split("T")[0],
    search: "",
    totalCount: 0,
    page: 1,
    size: 20,
    isPending: undefined,
  };

  constructor() {
    super();
    this.productInquiryApi = new InquiriesApi(this.core.apiConfig);
  }

  get inquiries(): ProductInquiry[] {
    return Object.values(this.entities);
  }

  get filter(): SearchQueryParam {
    return this.searchFilter;
  }

  public getProductInquiryById = (id: string): ProductInquiry | undefined => {
    return this.entities[id] ?? undefined;
  };

  public async list(params: Partial<SearchQueryParam>): Promise<void> {
    try {
      const res = await this.productInquiryApi.inquiriesList({
        ...params,
        dateFrom: params.dateFrom
          ? DateTime.fromISO(params.dateFrom).toISO()
          : undefined,
        dateTo: params.dateTo
          ? DateTime.fromISO(params.dateTo)
              .plus({ days: 1 })
              .minus({ milliseconds: 1 })
              .toISO()
          : undefined,
      });
      this.searchFilter = {
        ...params,
        totalCount: res.data.count ?? 0,
      };
      this._update(res.data.results);
    } catch (e) {
      this.catchError(e);
    }
  }

  public async createReply(rowId: string, body: string) {
    try {
      await this.productInquiryApi.inquiriesCreateReplyCreate({
        id: rowId,
        createProductInquiryReplyRequest: { body },
      });
    } catch (e) {
      this.catchError(e);
    }
  }

  public async removeReply(replyId: number) {
    try {
      await this.productInquiryApi.inquiriesDeleteReplyCreate({
        deleteProductInquiryReplyRequest: { id: replyId },
      });
    } catch (e) {
      this.catchError(e);
    }
  }

  private _update(data: ProductInquiryDto[]) {
    const newData: Record<string, ProductInquiry> = {};
    data.forEach((x) => {
      const id = x.id;
      newData[id] = { ...x, id };
    });
    this._updateEntities(newData);
  }
}

export const useProductInquiryService = () => {
  return new ProductInquiryService();
};
