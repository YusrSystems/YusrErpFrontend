import { ApiConstants, BaseApiService, FilterCondition, type FilterResult, type RequestResult, YusrApiHelper } from "@yusr_systems/core";
import Item, { BarcodeResult, DetailedItem, ItemType, StoreItem } from "../data/item";

export default class ItemsApiService extends BaseApiService<Item>
{
  routeName: string = "Items";

  override async Add(entity: Item)
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Add`,
      this.toDetailedDto(entity),
      undefined,
      "تم حفظ البيانات بنجاح"
    );
  }

  async FilterStoreItems(
    pageNumber: number,
    rowsPerPage: number,
    itemType: ItemType,
    storeId: number,
    condition?: FilterCondition
  ): Promise<RequestResult<FilterResult<StoreItem>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/FilterStoreItems?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}&itemType=${itemType}&storeId=${storeId}`,
      condition
    );
  }

  async GetByBarcode(
    barcode: string,
    storeId: number
  ): Promise<RequestResult<BarcodeResult>>
  {
    return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/GetByBarcode/${barcode}/${storeId}`);
  }

  override async Update(entity: Item)
  {
    return await YusrApiHelper.Put(
      `${ApiConstants.baseUrl}/${this.routeName}/Update`,
      this.toDetailedDto(entity),
      undefined,
      "تم تحديث المعلومات بنجاح"
    );
  }

  private toDetailedDto(entity: Item): DetailedItem
  {
    const { itemUnitPricingMethods, itemTaxes, itemStores, itemImages, ...itemFields } = entity;

    return new DetailedItem({
      item: itemFields as Item,
      itemUnitPricingMethods: itemUnitPricingMethods ?? [],
      itemTaxes: itemTaxes ?? [],
      itemStores: itemStores ?? [],
      itemImages: itemImages ?? []
    });
  }
}
