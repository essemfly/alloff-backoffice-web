import {
  PatchedProductRequest,
  Product as ProductDto,
  ProductsApi,
  ProductsApiProductsListRequest as ListRequest,
} from "@lessbutter/alloff-backoffice-api";

import { convertToSnakeCase } from "@app/helpers/change-case";
import Service from "@app/lib/Service";

import { getDeeplinkSettings } from "@app/core/configs";
import { FormSchema } from "./models/schema";

export type Product = ProductDto & { id: string };

export type SearchQueryParam = Omit<ListRequest, "isClassifiedDone"> & {
  offset: number;
  limit: number;
  totalItems: number;
  isClassifiedDone: string | undefined;
};

export default class ProductService extends Service<Product> {
  private productApi: ProductsApi;

  private searchFilter: SearchQueryParam = {
    offset: 0,
    limit: 50,
    brandId: "",
    alloffCategoryId: "",
    isClassifiedDone: undefined,
    searchQuery: "",
    totalItems: 0,
  };

  constructor() {
    super();
    this.productApi = new ProductsApi(this.core.apiConfig);
  }

  get products(): Product[] {
    return Object.values(this.entities);
  }

  get filter(): SearchQueryParam {
    return this.searchFilter;
  }

  public getProductById = (id: string): Product | undefined => {
    return this.entities[id] ?? undefined;
  };

  public async list(params: SearchQueryParam): Promise<void> {
    try {
      const res = await this.productApi.productsList(params as ListRequest);
      this._update(res.data.products);
      this.searchFilter = {
        offset: res.data.offset,
        limit: res.data.limit,
        brandId: res.data.list_query.brand_id,
        alloffCategoryId: res.data.list_query.alloff_category_id,
        isClassifiedDone:
          res.data.list_query.is_classified_done?.toString() ?? undefined,
        searchQuery: res.data.list_query.search_query,
        totalItems: res.data.total_counts,
      };
    } catch (e) {
      this.catchError(e);
    }
  }

  public async load(id: string): Promise<Product | undefined> {
    try {
      const res = await this.productApi.productsRetrieve({ id });
      this._update([res.data]);
      return this.entities[res.data.alloff_product_id];
    } catch (e) {
      this.catchError(e);
    }
  }

  public async create(data: FormSchema): Promise<void> {
    try {
      await this.productApi.productsCreate({
        createProductRequestApiRequest: convertToSnakeCase(data),
      });
    } catch (e) {
      this.catchError(e);
    }
  }

  public async edit(id: string, data: FormSchema) {
    try {
      await this.productApi.productsUpdate({
        id,
        editProductRequestApiRequest: convertToSnakeCase(data),
      });
    } catch (e) {
      this.catchError(e);
    }
  }

  public async patch(
    id: string,
    data: Partial<PatchedProductRequest>,
  ): Promise<void> {
    try {
      const res = await this.productApi.productsPartialUpdate({
        id,
        patchedProductRequest: convertToSnakeCase({
          productId: id,
          ...data,
        }),
      });
      this._update([res.data]);
    } catch (e) {
      this.catchError(e);
    }
  }

  public async getDeeplink(productId: string) {
    const {
      apiKey,
      domain,
      domainUriPrefix,
      androidPackageName,
      androidFallbackLink,
      iosBundleId,
      iosFallbackLink,
    } = getDeeplinkSettings();

    const firebaseUrl = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`;
    const longLink = `https://${domain}.lett.io/products/${productId}`;
    const res = await fetch(firebaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dynamicLinkInfo: {
          domainUriPrefix,
          link: longLink,
          androidInfo: {
            androidPackageName,
            androidFallbackLink,
          },
          iosInfo: {
            iosBundleId,
            iosFallbackLink,
          },
        },
      }),
    });
    const json = await res.json();
    return json.shortLink;
  }

  private _update(data: ProductDto[]) {
    const newData: Record<string, Product> = {};
    data.forEach((x) => {
      const id = x.alloff_product_id;
      newData[id] = { ...x, id };
    });
    this._updateEntities(newData);
  }
}

export const useProductService = () => {
  return new ProductService();
};
