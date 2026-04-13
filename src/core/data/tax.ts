import { BaseEntity, type ColumnName, type ValidationRule, Validators } from "@yusr_systems/core";
import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "@yusr_systems/ui";
import TaxesApiService from "../networking/taxesApiService";

export class Tax extends BaseEntity
{
  public name!: string;
  public percentage!: number;
  public isPrimary!: boolean;

  constructor(init?: Partial<Tax>)
  {
    super();
    Object.assign(this, init);
  }
}

export class TaxFilterColumns
{
  public static columnsNames: ColumnName[] = [{ label: "اسم الضريبة", value: "Name" }];
}

export class TaxValidationRules
{
  public static validationRules: ValidationRule<Partial<Tax>>[] = [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required("يرجى إدخال اسم الوحدة")]
  }];
}

export class TaxSlice
{
  private static entitySliceInstance = createGenericEntitySlice("tax", new TaxesApiService());
  public static entityActions = TaxSlice.entitySliceInstance.actions;
  public static entityReducer = TaxSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<Tax>("taxDialog");
  public static dialogActions = TaxSlice.dialogSliceInstance.actions;
  public static dialogReducer = TaxSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<Tax>("taxForm");
  public static formActions = TaxSlice.formSliceInstance.actions;
  public static formReducer = TaxSlice.formSliceInstance.reducer;
}
