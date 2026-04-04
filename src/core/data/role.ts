import { BaseEntity, type ColumnName } from "@yusr_systems/core";

export class Role extends BaseEntity
{
  public name!: string;
  public permissions!: string[];

  constructor(init?: Partial<Role>)
  {
    super();
    Object.assign(this, init);
  }
}

export class RoleFilterColumns
{
  public static columnsNames: ColumnName[] = [{ label: "اسم الدور", value: "Name" }];
}
