import { BaseEntity, Validators, type ColumnName, type ValidationRule } from "@yusr_systems/core";
import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "@yusr_systems/ui";
import UnitsApiService from "../networking/unitApiService";

export default class Unit extends BaseEntity
{
  public name!: string;

  constructor(init?: Partial<Unit>)
  {
    super();
    Object.assign(this, init);
  }
}

export class UnitFilterColumns
{
  public static columnsNames: ColumnName[] = [{ label: "رقم الوحدة", value: "Id" }, {
    label: "اسم الوحدة",
    value: "name"
  }];
}

export class UnitValidationRules
{
  public static validationRules: ValidationRule<Partial<Unit>>[] = [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required("يرجى إدخال اسم الوحدة")]
  }];
}

export class UnitSlice
{
  private static entitySliceInstance = createGenericEntitySlice("unit", new UnitsApiService());
  public static entityActions = UnitSlice.entitySliceInstance.actions;
  public static entityReducer = UnitSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<Unit>("unitDialog");
  public static dialogActions = UnitSlice.dialogSliceInstance.actions;
  public static dialogReducer = UnitSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<Unit>("unitForm");
  public static formActions = UnitSlice.formSliceInstance.actions;
  public static formReducer = UnitSlice.formSliceInstance.reducer;
}
