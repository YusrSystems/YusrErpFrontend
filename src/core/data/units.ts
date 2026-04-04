import { BaseEntity, type ColumnName } from "@yusr_systems/core";

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
