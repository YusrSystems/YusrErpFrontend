import { BaseEntity, type ColumnName, type ValidationRule, Validators } from "@yusr_systems/core";
import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "@yusr_systems/ui";
import StoresApiService from "../networking/storeApiService";

export default class Store extends BaseEntity
{
  public name!: string;
  public createdBy!: number;
  public authorized!: boolean;

  constructor(init?: Partial<Store>)
  {
    super();
    Object.assign(this, init);
  }
}

export class StoreFilterColumns
{
  public static columnsNames: ColumnName[] = [{ label: "رقم المستودع", value: "Id" }, {
    label: "اسم المستودع",
    value: "StoreName"
  }];
}

export class StoreValidationRules
{
  public static validationRules: ValidationRule<Partial<Store>>[] = [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required("يرجى إدخال اسم المستودع")]
  }];
}

export class StoreSlice
{
  private static entitySliceInstance = createGenericEntitySlice("store", new StoresApiService());
  public static entityActions = StoreSlice.entitySliceInstance.actions;
  public static entityReducer = StoreSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<Store>("storeDialog");
  public static dialogActions = StoreSlice.dialogSliceInstance.actions;
  public static dialogReducer = StoreSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<Store>("storeForm");
  public static formActions = StoreSlice.formSliceInstance.actions;
  public static formReducer = StoreSlice.formSliceInstance.reducer;
}
