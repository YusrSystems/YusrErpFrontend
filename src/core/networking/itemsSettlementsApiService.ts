import { BaseApiService } from "@yusr_systems/core";
import type ItemsSettlement from "../data/itemsSettlement";

export default class ItemsSettlementsApiService extends BaseApiService<ItemsSettlement>
{
  routeName: string = "ItemSettlements";
}
