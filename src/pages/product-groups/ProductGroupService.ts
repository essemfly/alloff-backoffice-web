import {
  PatchedProductGroupRequest,
  ProductGroup as ProductGroupDto,
  ProductGroupsApi,
  ProductGroupsApiProductGroupsListRequest as ListRequest,
} from "@lessbutter/alloff-backoffice-api";

import { convertToSnakeCase } from "@app/helpers/change-case";
import Service from "@app/lib/Service";

import { FormSchema } from "./models/schema";

export type ProductGroup = ProductGroupDto & { id: string };

export type SearchQueryParam = ListRequest & {
  offset: number;
  limit: number;
  totalCounts: number;
};

export default class ProductGroupService extends Service<ProductGroup> {
  private productGroupApi: ProductGroupsApi;

  private searchFilter: SearchQueryParam = {
    offset: 0,
    limit: 50,
    searchQuery: "",
    totalCounts: 0,
  };

  constructor() {
    super();
    this.productGroupApi = new ProductGroupsApi(this.core.apiConfig);
  }

  get productGroups(): ProductGroup[] {
    return Object.values(this.entities);
  }

  get filter(): SearchQueryParam {
    return this.searchFilter;
  }

  public getProductGroupById = (id: string): ProductGroup | undefined => {
    return this.entities[id] ?? undefined;
  };

  public async list(params: SearchQueryParam): Promise<void> {
    try {
      const res = await this.productGroupApi.productGroupsList(params);
      this._update(res.data.pgs);
      this.searchFilter = {
        offset: res.data.offset,
        limit: res.data.limit,
        searchQuery: params.searchQuery ?? "",
        totalCounts: res.data.total_counts,
      };
    } catch (e) {
      this.catchError(e);
    }
  }

  public async load(id: string): Promise<ProductGroup | undefined> {
    try {
      const res = await this.productGroupApi.productGroupsRetrieve({ id });
      this._update([res.data]);
      return this.entities[res.data.product_group_id];
    } catch (e) {
      this.catchError(e);
    }
  }

  public async create(data: FormSchema): Promise<string | undefined> {
    try {
      const res = await this.productGroupApi.productGroupsCreate({
        createProductGroupSeriazlierRequest: convertToSnakeCase(data),
      });
      return res.data.product_group_id;
    } catch (e) {
      this.catchError(e);
    }
  }

  public async edit(id: string, data: FormSchema) {
    try {
      await this.productGroupApi.productGroupsUpdate({
        id,
        editProductGroupRequest: convertToSnakeCase(data),
      });
    } catch (e) {
      this.catchError(e);
    }
  }

  public async patch(
    id: string,
    data: Partial<PatchedProductGroupRequest>,
  ): Promise<void> {
    try {
      const res = await this.productGroupApi.productGroupsPartialUpdate({
        id,
        patchedProductGroupRequest: convertToSnakeCase({
          productGroupId: id,
          ...data,
        }),
      });
      this._update([res.data]);
    } catch (e) {
      this.catchError(e);
    }
  }

  public async pushProducts(id: string, data: any) {
    try {
      const res = await this.productGroupApi.productGroupsUpdateProductsCreate({
        id: id,
        productsInPgRequest: convertToSnakeCase({
          productGroupId: id,
          productPriorities: data,
        }),
      });
      this._update([res.data]);
    } catch (e) {
      this.catchError(e);
    }
  }

  public async updateProducts(id: string, data: any) {
    try {
      const res = await this.productGroupApi.productGroupsUpdateProductsCreate({
        id: id,
        productsInPgRequest: convertToSnakeCase({
          productGroupId: id,
          productPriorities: data,
        }),
      });
      this._update([res.data]);
    } catch (e) {
      this.catchError(e);
    }
  }

  public async deleteProduct(id: string, productId: string) {
    try {
      const res = await this.productGroupApi.productGroupsRemoveProductCreate({
        id,
        removeProductInPgRequest: convertToSnakeCase({
          productGroupId: id,
          productId,
        }),
      });
      this._update([res.data]);
    } catch (e) {
      this.catchError(e);
    }
  }

  private _update(data: ProductGroupDto[]) {
    const newData: Record<string, ProductGroup> = {};
    data.forEach((x) => {
      const id = x.product_group_id;
      newData[id] = { ...x, id };
    });
    this._updateEntities(newData);
  }
}

export const useProductGroupService = () => {
  return new ProductGroupService();
};
