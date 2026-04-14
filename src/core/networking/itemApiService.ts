import { ApiConstants, BaseApiService, type FilterResult, type RequestResult, YusrApiHelper } from "@yusr_systems/core";
import type { FilterByTypeRequest } from "../data/filterByTypeRequest";
import Item, { BarcodeResult, StoreItem } from "../data/item";

export default class ItemsApiService extends BaseApiService<Item>
{
  routeName: string = "Items";

  async FilterStoreItems(
    pageNumber: number,
    rowsPerPage: number,
    storeId: number | undefined,
    request: FilterByTypeRequest
  ): Promise<RequestResult<FilterResult<StoreItem>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/FilterStoreItems?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}&${
        storeId == undefined ? "" : `storeId=${storeId}`
      }`,
      request
    );
  }

  async GetByBarcode(
    barcode: string,
    storeId: number
  ): Promise<RequestResult<BarcodeResult>>
  {
    return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/GetByBarcode/${barcode}/${storeId}`);
  }
}
