import { BaseEntity, type ColumnName } from "@yusr_systems/core";
import { createGenericDialogSlice, createGenericEntitySlice } from "@yusr_systems/ui";
import StocktakingsApiService from "../networking/stocktakingApiService";

export class StocktakingItem extends BaseEntity {
  public stocktakingId!: number;
  public itemId!: number;
  public itemName!: string;
  public itemUnitPricingMethodId!: number;
  public itemUnitPricingMethodName!: string;
  public quantityMultiplier!: number;
  public systemQuantity!: number;
  public variance!: number;
  public actualQuantity!: number;

  constructor(init?: Partial<StocktakingItem>) {
    super();
    Object.assign(this, init);
  }
}

export default class Stocktaking extends BaseEntity {
  public description?: string;
  public date!: string | Date;
  public storeId!: number;
  public storeName!: string;
  public stocktakingItems: StocktakingItem[] = [];

  constructor(init?: Partial<Stocktaking>) {
    super();
    Object.assign(this, init);
    if (init?.stocktakingItems) {
      this.stocktakingItems = init.stocktakingItems.map(x => new StocktakingItem(x));
    }
  }
}

export class StocktakingFilterColumns {
  public static columnsNames: ColumnName[] = [
    { label: "رقم الجرد", value: "Id" },
    { label: "المستودع", value: "StoreName" },
    { label: "الوصف", value: "Description" }
  ];
}

export class StocktakingSlice {
  private static entitySliceInstance = createGenericEntitySlice(
    "stocktaking",
    new StocktakingsApiService()
  );

  public static entityActions = StocktakingSlice.entitySliceInstance.actions;
  public static entityReducer = StocktakingSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<Stocktaking>("stocktakingDialog");

  public static dialogActions = StocktakingSlice.dialogSliceInstance.actions;
  public static dialogReducer = StocktakingSlice.dialogSliceInstance.reducer;
}