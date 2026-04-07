import { BaseEntity, type ColumnName } from "@yusr_systems/core";
import { createGenericDialogSlice, createGenericEntitySlice } from "@yusr_systems/ui";
import ItemTransferApiService from "../networking/itemTransferApiService";
import type { ItemUnitPricingMethod } from "./item";


export class ItemTransfersItem extends BaseEntity {
  public itemTransferId!: number;
  public itemId!: number;
  public itemName!: string;
  public itemUnitPricingMethodId!: number;
  public itemUnitPricingMethodName!: string;
  public quantity!: number;
  public itemUnitPricingMethods: ItemUnitPricingMethod[] = [];

  constructor(init?: Partial<ItemTransfersItem>) {
    super();
    Object.assign(this, init);
  }
}

export default class ItemTransfer extends BaseEntity {
  public description?: string;
  public transferDate: Date = new Date();
  public fromStoreId!: number;
  public fromStoreName: string = "";
  public toStoreId!: number;
  public toStoreName: string = "";
  public itemTransfersItems: ItemTransfersItem[] = [];

  constructor(init?: Partial<ItemTransfer>) {
    super();
    Object.assign(this, init);
    if (init?.transferDate) this.transferDate = new Date(init.transferDate);
    if (init?.itemTransfersItems) {
      this.itemTransfersItems = init.itemTransfersItems.map(i => new ItemTransfersItem(i));
    }
  }
}

export class ItemTransferFilterColumns {
  public static columnsNames: ColumnName[] = [
    { label: "رقم التحويل", value: "Id" },
    { label: "المستودع المحول منه", value: "FromStoreName" },
    { label: "المستودع المحول إليه", value: "ToStoreName" },
    { label: "الوصف", value: "Description" },
  ];
}

export class ItemTransferSlice {
  private static entitySliceInstance = createGenericEntitySlice(
    "itemTransfer",
    new ItemTransferApiService()
  );

  public static entityActions = ItemTransferSlice.entitySliceInstance.actions;
  public static entityReducer = ItemTransferSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<ItemTransfer>("itemTransferDialog");

  public static dialogActions = ItemTransferSlice.dialogSliceInstance.actions;
  public static dialogReducer = ItemTransferSlice.dialogSliceInstance.reducer;
}