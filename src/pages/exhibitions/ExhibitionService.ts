import {
  Exhibition as ExhibitionDto,
  ExhibitionsApi,
  ExhibitionsApiExhibitionsListRequest as ListRequest,
  ExhibitionTypeEnum,
  PatchedExhibitionRequest,
} from "@lessbutter/alloff-backoffice-api";

import { convertToSnakeCase } from "@app/helpers/change-case";
import Service from "@app/lib/Service";

import { FormSchema as ProductGroupFormSchema } from "../product-groups/models/schema";
import ProductGroupService, {
  ProductGroup,
  useProductGroupService,
} from "../product-groups/ProductGroupService";
import { getExhibitionTypeByIndex } from "./commands/helpers";
import { FormSchema } from "./models/schema";

export type Exhibition = ExhibitionDto & { id: string };

export type SearchQueryParam = ListRequest & {
  offset: number;
  limit: number;
  totalItems: number;
};

export default class ExhibitionService extends Service<Exhibition> {
  private productGroupService: ProductGroupService;
  private exhibitionApi: ExhibitionsApi;

  private searchFilter: SearchQueryParam = {
    offset: 0,
    limit: 50,
    exhibitionType: ExhibitionTypeEnum.Normal,
    isLive: true,
    query: "",
    totalItems: 0,
  };

  constructor(productGroupService: ProductGroupService) {
    super();
    this.productGroupService = productGroupService;
    this.exhibitionApi = new ExhibitionsApi(this.core.apiConfig);
  }

  get exhibitions(): Exhibition[] {
    return Object.values(this.entities);
  }

  get filter(): SearchQueryParam {
    return this.searchFilter;
  }

  public getExhibitionById = (id: string): Exhibition | undefined => {
    return this.entities[id] ?? undefined;
  };

  public async list(params: SearchQueryParam): Promise<void> {
    try {
      const res = await this.exhibitionApi.exhibitionsList(params);
      this._update(res.data.exhibitions);
      this.searchFilter = {
        offset: res.data.offset,
        limit: res.data.limit,
        exhibitionType: getExhibitionTypeByIndex(
          res.data.group_type as unknown as number,
        ),
        isLive: res.data.is_live,
        query: res.data.query,
        totalItems: res.data.total_counts,
      };
    } catch (e) {
      this.catchError(e);
    }
  }

  public async load(id: string): Promise<Exhibition | undefined> {
    try {
      const res = await this.exhibitionApi.exhibitionsRetrieve({ id });
      this._update([res.data]);
      return this.entities[res.data.exhibition_id];
    } catch (e) {
      this.catchError(e);
    }
  }

  public async create(data: FormSchema): Promise<void> {
    try {
      await this.exhibitionApi.exhibitionsCreate({
        createExhibitionRequest: convertToSnakeCase(data),
      });
    } catch (e) {
      this.catchError(e);
    }
  }

  public async edit(id: string, data: FormSchema) {
    try {
      await this.exhibitionApi.exhibitionsUpdate({
        id,
        editExhibitionRequest: convertToSnakeCase(data),
      });
    } catch (e) {
      this.catchError(e);
    }
  }

  public async patch(
    id: string,
    data: Partial<PatchedExhibitionRequest>,
  ): Promise<void> {
    try {
      const res = await this.exhibitionApi.exhibitionsPartialUpdate({
        id,
        patchedExhibitionRequest: convertToSnakeCase({
          exhibitionId: id,
          ...data,
        }),
      });
      this._update([res.data]);
    } catch (e) {
      this.catchError(e);
    }
  }

  public async loadProductGroup(id: string): Promise<ProductGroup | undefined> {
    try {
      const res = await this.productGroupService.load(id);
      return res;
    } catch (e) {
      this.catchError(e);
    }
  }

  public async createProductGroup(
    data: ProductGroupFormSchema,
  ): Promise<string | undefined> {
    try {
      const res = await this.productGroupService.create(data);
      return res;
    } catch (e) {
      this.catchError(e);
    }
  }

  public async pushProducts(id: string, data: any) {
    try {
      await this.productGroupService.pushProducts(id, data);
    } catch (e) {
      this.catchError(e);
    }
  }

  private _update(data: ExhibitionDto[]) {
    const newData: Record<string, Exhibition> = {};
    data.forEach((x) => {
      const id = x.exhibition_id;
      newData[id] = { ...x, id };
    });
    this._updateEntities(newData);
  }
}

export const useExhibitionService = () => {
  const productGroupService = useProductGroupService();
  return new ExhibitionService(productGroupService);
};
