import { BaseEntity, type ColumnName } from "@yusr_systems/core";
import {
  createGenericDialogSlice,
  createGenericEntitySlice,
} from "@yusr_systems/ui";
import PricingMethodsApiService from "../networking/PricingMethodsApiService";

export default class PricingMethod extends BaseEntity {
  public pricingMethodName!: string;

  constructor(init?: Partial<PricingMethod>) {
    super();
    Object.assign(this, init);
  }
}

export class PricingMethodFilterColumns {
  public static columnsNames: ColumnName[] = [
    { label: "رقم الطريقة", value: "Id" },
    { label: "اسم طريقة التسعير", value: "PricingMethodName" },
  ];
}

export class PricingMethodSlice {
  private static entitySliceInstance = createGenericEntitySlice(
    "pricingMethod",
    new PricingMethodsApiService(),
  );

  public static entityActions = PricingMethodSlice.entitySliceInstance.actions;
  public static entityReducer = PricingMethodSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<PricingMethod>(
    "pricingMethodDialog",
  );

  public static dialogActions = PricingMethodSlice.dialogSliceInstance.actions;
  public static dialogReducer = PricingMethodSlice.dialogSliceInstance.reducer;
}
