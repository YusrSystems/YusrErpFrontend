import { BaseApiService } from "@yusr_systems/core";
import type ItemTransfer from "../data/itemTransfer";

export default class ItemTransferApiService extends BaseApiService<ItemTransfer> {
  routeName: string = "ItemTransfers";
}