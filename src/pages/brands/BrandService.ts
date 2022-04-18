import {
  Brand as BrandDto,
  BrandsApi,
  BrandsApiBrandsCreateRequest,
  BrandsApiBrandsPartialUpdateRequest,
  BrandsApiBrandsUpdateRequest,
} from "@lessbutter/alloff-backoffice-api";

import { apiConfigsTS } from "@app/store";
import Service from "@app/lib/Service";
import { convertToSnakeCase } from "@app/helpers/change-case";
import { get } from "svelte/store";
import { FormSchema } from "./models/schema";

interface Brand extends BrandDto {
  id: string;
}

export default class BrandService extends Service<Brand> {
  private brandApi: BrandsApi;

  constructor() {
    super();
    this.brandApi = new BrandsApi(apiConfigsTS);
  }

  public get brands(): Brand[] {
    return Object.values(this.entities);
  }

  public async list(): Promise<void> {
    try {
      const res = await this.brandApi.brandsList();
      this._update(res.data);
    } catch (e) {
      this.catchError(e);
    }
  }

  public load(id: string): Brand | undefined {
    if (this.brands.length > 0) {
      return get(this.entities)[id] ?? undefined;
    }
    return undefined;
  }

  public async create(data: FormSchema): Promise<void> {
    try {
      await this.brandApi.brandsCreate({
        createBrandRequest: convertToSnakeCase(data),
      });
    } catch (e) {
      this.catchError(e);
    }
  }

  public async edit(id: string, data: FormSchema) {
    try {
      await this.brandApi.brandsUpdate({
        id,
        editBrandRequest: convertToSnakeCase(data),
      });
    } catch (e) {
      this.catchError(e);
    }
  }

  public async patch(
    id: string,
    keyname: string,
    data: Partial<BrandsApiBrandsPartialUpdateRequest>,
  ): Promise<void> {
    try {
      await this.brandApi.brandsPartialUpdate({
        id,
        patchedBrandRequest: convertToSnakeCase({
          keyname,
          brandId: id,
          ...data,
        }),
      });
    } catch (e) {
      this.catchError(e);
    }
  }

  private _update(data: BrandDto[]) {
    const newData: Record<string, Brand> = {};
    data.forEach((x) => {
      const id = x.brand_id;
      newData[id] = { ...x, id };
    });
  }
}

export const useBrandService = () => {
  return new BrandService();
};
