import { User, UsersApiService, type ValidationRule, Validators } from "@yusr_systems/core";
import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "@yusr_systems/ui";

export class UserValidationRules
{
  public static validationRules: ValidationRule<Partial<User>>[] = [
    {
      field: "username",
      selector: (d) => d.username,
      validators: [Validators.required("يرجى إدخال اسم المستخدم")]
    },
    { field: "password", selector: (d) => d.password, validators: [Validators.required("يرجى إدخال كلمة مرور")] },
    {
      field: "roleId",
      selector: (d) => d.roleId,
      validators: [Validators.required("يرجى اختيار دور")]
    },
    { field: "branchId", selector: (d) => d.branchId, validators: [Validators.required("يرجى اختيار فرع")] }
  ];
}

export class UserSlice
{
  private static entitySliceInstance = createGenericEntitySlice("branch", new UsersApiService());
  public static entityActions = UserSlice.entitySliceInstance.actions;
  public static entityReducer = UserSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<User>("branchDialog");
  public static dialogActions = UserSlice.dialogSliceInstance.actions;
  public static dialogReducer = UserSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<User>("branchForm");
  public static formActions = UserSlice.formSliceInstance.actions;
  public static formReducer = UserSlice.formSliceInstance.reducer;
}
