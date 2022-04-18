import {
  TopBanner as BannerDto,
  TopBannersApiTopBannersListRequest as SearchQueryParam,
  TopBannersApi,
  TopBannersApiTopBannersPartialUpdateRequest,
} from "@lessbutter/alloff-backoffice-api";

import Service from "@app/lib/Service";
import { convertToSnakeCase } from "@app/helpers/change-case";

import { FormSchema } from "./models/schema";

type Banner = BannerDto & { id: string };

export default class BannerService extends Service<Banner> {
  private bannerApi: TopBannersApi;

  constructor() {
    super();
    this.bannerApi = new TopBannersApi(this.core.apiConfig);
  }

  public get banners(): Banner[] {
    return Object.values(this.entities);
  }

  public getBannerById = (id: string): Banner | undefined => {
    return this.entities[id] ?? undefined;
  };

  public async list(params: SearchQueryParam): Promise<void> {
    try {
      const res = await this.bannerApi.topBannersList(params);
      this._update(res.data.banners);
    } catch (e) {
      this.catchError(e);
    }
  }

  public async load(id: string): Promise<Banner | undefined> {
    try {
      const res = await this.bannerApi.topBannersRetrieve({ id });
      this._update([res.data]);
      return { ...res.data, id: res.data.banner_id };
    } catch (e) {
      this.catchError(e);
    }
  }

  public async create(data: FormSchema): Promise<void> {
    try {
      await this.bannerApi.topBannersCreate({
        createTopBannerRequest: convertToSnakeCase(data),
      });
    } catch (e) {
      this.catchError(e);
    }
  }

  public async edit(id: string, data: FormSchema) {
    try {
      await this.bannerApi.topBannersUpdate({
        id,
        editTopBannerRequest: convertToSnakeCase(data),
      });
    } catch (e) {
      this.catchError(e);
    }
  }

  public async patch(
    id: string,
    data: Partial<TopBannersApiTopBannersPartialUpdateRequest>,
  ): Promise<void> {
    try {
      await this.bannerApi.topBannersPartialUpdate({
        id,
        patchedTopBannerRequest: convertToSnakeCase(data),
      });
    } catch (e) {
      this.catchError(e);
    }
  }

  private _update(data: BannerDto[]) {
    const newData: Record<string, Banner> = {};
    data.forEach((x) => {
      const id = x.exhibition_id;
      newData[id] = { ...x, id };
    });
    this._updateEntities(newData);
  }
}

export const useBannerService = () => {
  return new BannerService();
};
