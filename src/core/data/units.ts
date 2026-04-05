import { BaseEntity, type ColumnName } from "@yusr_systems/core";
import {
  createGenericDialogSlice,
  createGenericEntitySlice,
} from "@yusr_systems/ui";
import UnitsApiService from "../networking/unitApiService";

export default class Unit extends BaseEntity {
  public unitName!: string;

  constructor(init?: Partial<Unit>) {
    super();
    Object.assign(this, init);
  }
}

export class UnitFilterColumns {
  public static columnsNames: ColumnName[] = [
    { label: "رقم الوحدة", value: "Id" },
    { label: "اسم الوحدة", value: "UnitName" },
  ];
}

export class UnitSlice {
  private static entitySliceInstance = createGenericEntitySlice(
    "unit",
    new UnitsApiService(),
  );

  public static entityActions = UnitSlice.entitySliceInstance.actions;
  public static entityReducer = UnitSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance =
    createGenericDialogSlice<Unit>("unitDialog");

  public static dialogActions = UnitSlice.dialogSliceInstance.actions;
  public static dialogReducer = UnitSlice.dialogSliceInstance.reducer;
}
