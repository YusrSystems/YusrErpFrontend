import { BaseEntity, type ColumnName } from "@yusr_systems/core";

export default class Store extends BaseEntity {
  public storeName!: string;
  public createdBy!: number;
  public authorized!: boolean;

  constructor(init?: Partial<Store>) {
    super();
    Object.assign(this, init);
  }
}

export class StoreFilterColumns {
  public static columnsNames: ColumnName[] = [
    { label: "رقم المستودع", value: "Id" },
    { label: "اسم المستودع", value: "StoreName" },
  ];
}
