import {
  Brand as BrandDto,
  BrandsApi,
  BrandsApiBrandsPartialUpdateRequest,
} from "@lessbutter/alloff-backoffice-api";

import { apiConfigsTS } from "@app/store";
import Service from "@app/lib/Service";
import { convertToSnakeCase } from "@app/helpers/change-case";

interface Brand extends BrandDto {
  id: string;
}

export default class BrandService extends Service<Brand> {
  private brandApi: BrandsApi;

  public get brands() {
    return Object.values(this.entities);
  }

  constructor() {
    super();
    this.brandApi = new BrandsApi(apiConfigsTS);
  }

  private update(data: BrandDto[]) {
    const newData: Record<string, Brand> = {};
    data.forEach((x) => {
      const id = x.brand_id;
      newData[id] = { ...x, id };
    });
  }

  public async list() {
    try {
      const res = await this.brandApi.brandsList();
      this.update(res.data);
    } catch (e) {
      this.catchError(e);
    }
  }

  public async load() {
    // todo
  }

  public async patch(
    id: string,
    keyname: string,
    data: Partial<BrandsApiBrandsPartialUpdateRequest>,
  ) {
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
}

export const useBrandService = () => {
  return new BrandService();
};
