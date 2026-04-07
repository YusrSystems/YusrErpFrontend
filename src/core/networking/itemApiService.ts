import { ApiConstants, BaseApiService, YusrApiHelper } from "@yusr_systems/core";
import Item, { DetailedItem } from "../data/item";

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
