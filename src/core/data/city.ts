import { BaseEntity, type ColumnName } from "@yusr_systems/core";
import type { Country } from "./country";

export class City extends BaseEntity
{
  public name!: string;
  public countryId!: number;
  public country!: Country;

  constructor(init?: Partial<City>)
  {
    super();
    Object.assign(this, init);
  }
}

export class CityFilterColumns
{
  public static columnsNames: ColumnName[] = [{ label: "اسم المدينة", value: "Name" }];
}
