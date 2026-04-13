import { Branch, BranchesApiService, type ValidationRule, Validators } from "@yusr_systems/core";
import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "@yusr_systems/ui";

export class BranchValidationRules
{
  public static validationRules: ValidationRule<Partial<Branch>>[] = [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required("اسم الفرع مطلوب")]
  }, {
    field: "cityId",
    selector: (d) => d.cityId,
    validators: [Validators.required("يرجى اختيار المدينة")]
  }];
}

export class BranchSlice
{
  private static entitySliceInstance = createGenericEntitySlice("branch", new BranchesApiService());
  public static entityActions = BranchSlice.entitySliceInstance.actions;
  public static entityReducer = BranchSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<Branch>("branchDialog");
  public static dialogActions = BranchSlice.dialogSliceInstance.actions;
  public static dialogReducer = BranchSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<Branch>("branchForm");
  public static formActions = BranchSlice.formSliceInstance.actions;
  public static formReducer = BranchSlice.formSliceInstance.reducer;
}
