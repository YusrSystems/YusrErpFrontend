import { BaseEntity, type ColumnName } from "@yusr_systems/core";

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

export class CityFilterColumns
{
  public static columnsNames: ColumnName[] = [{ label: "اسم الضريبة", value: "Name" }];
}