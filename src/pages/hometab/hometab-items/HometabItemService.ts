import {
  HomeTab as HomeTabItemDto,
  HometabsApi,
  HometabsApiHometabsListRequest as ListRequest,
  PatchedHomeTabRequest,
} from "@lessbutter/alloff-backoffice-api";

import { convertToSnakeCase } from "@app/helpers/change-case";
import Service from "@app/lib/Service";

import { FormSchema } from "./models/schema";

type HomeTabItem = HomeTabItemDto & { id: string };

export type SearchQueryParam = ListRequest & {
  offset: number;
  limit: number;
  totalCounts: number;
};

export default class HometabItemService extends Service<HomeTabItem> {
  private hometabApi: HometabsApi;

  private searchFilter: SearchQueryParam = {
    offset: 0,
    limit: 50,
    totalCounts: 0,
  };

  constructor() {
    super();
    this.hometabApi = new HometabsApi(this.core.apiConfig);
  }

  public get hometabItems(): HomeTabItem[] {
    return Object.values(this.entities);
  }

  get filter(): SearchQueryParam {
    return this.searchFilter;
  }

  public getHometabItemById = (id: string): HomeTabItem | undefined => {
    return this.entities[id] ?? undefined;
  };

  public async list(params: SearchQueryParam): Promise<void> {
    try {
      const res = await this.hometabApi.hometabsList(params);
      this._update(res.data.items);
      this.searchFilter = {
        offset: res.data.offset,
        limit: res.data.limit,
        totalCounts: res.data.total_counts,
      };
    } catch (e) {
      this.catchError(e);
    }
  }

  public async load(id: string): Promise<HomeTabItem | undefined> {
    try {
      const res = await this.hometabApi.hometabsRetrieve({ id });
      this._update([res.data]);
      return { ...res.data, id: res.data.item_id };
    } catch (e) {
      this.catchError(e);
    }
  }

  public async create(data: FormSchema): Promise<void> {
    try {
      await this.hometabApi.hometabsCreate({
        createHomeTabRequest: convertToSnakeCase(data),
      });
    } catch (e) {
      this.catchError(e);
    }
  }

  public async edit(id: string, data: FormSchema) {
    try {
      await this.hometabApi.hometabsUpdate({
        id,
        editHomeTabRequest: convertToSnakeCase({ hometabId: id, ...data }),
      });
    } catch (e) {
      this.catchError(e);
    }
  }

  public async patch(
    id: string,
    data: Partial<PatchedHomeTabRequest>,
  ): Promise<void> {
    try {
      await this.hometabApi.hometabsPartialUpdate({
        id,
        patchedHomeTabRequest: convertToSnakeCase({ hometabId: id, ...data }),
      });
    } catch (e) {
      this.catchError(e);
    }
  }

  private _update(data: HomeTabItemDto[]) {
    const newData: Record<string, HomeTabItem> = {};
    data.forEach((x) => {
      const id = x.item_id;
      newData[id] = { ...x, id };
    });
    this._updateEntities(newData);
  }
}

export const useHometabItemService = () => {
  return new HometabItemService();
};
