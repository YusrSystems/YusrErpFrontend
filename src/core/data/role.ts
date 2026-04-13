import { BaseEntity, type ColumnName, RolesApiService, type ValidationRule, Validators } from "@yusr_systems/core";
import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "@yusr_systems/ui";

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

export class RoleValidationRules
{
  public static validationRules: ValidationRule<Partial<Role>>[] = [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required("يرجى اختيار اسم للدور")]
  }];
}

export class RoleSlice
{
  private static entitySliceInstance = createGenericEntitySlice("role", new RolesApiService());
  public static entityActions = RoleSlice.entitySliceInstance.actions;
  public static entityReducer = RoleSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<Role>("roleDialog");
  public static dialogActions = RoleSlice.dialogSliceInstance.actions;
  public static dialogReducer = RoleSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<Role>("roleForm");
  public static formActions = RoleSlice.formSliceInstance.actions;
  public static formReducer = RoleSlice.formSliceInstance.reducer;
}
