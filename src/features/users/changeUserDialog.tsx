import { RoleFilterColumns, User } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, FieldGroup, FormField, PasswordField, SearchableSelect, SelectField, TextField, useFormErrors, useFormInit, useValidate } from "@yusr_systems/ui";
import { useEffect, useMemo } from "react";
import { BranchSlice } from "../../core/data/branchLogic";
import { RoleSlice } from "../../core/data/role";
import { UserSlice, UserValidationRules } from "../../core/data/UserLogic";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangeUserDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<User>)
{
  const roleState = useAppSelector((state) => state.role);
  const branchState = useAppSelector((state) => state.branch);
  const dispatch = useAppDispatch();

  const initialValues = useMemo(() => ({ ...entity, password: "" }), [entity]);

  const { formData, errors } = useAppSelector((state) => state.userForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    UserValidationRules.validationRules,
    (errors) => dispatch(UserSlice.formActions.setErrors(errors))
  );
  useFormInit(UserSlice.formActions.setInitialData, initialValues);

  useEffect(() =>
  {
    dispatch(RoleSlice.entityActions.filter());
    dispatch(BranchSlice.entityActions.filter());
  }, [dispatch]);

  return (
    <ChangeDialog<User>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} مستخدم` }
      className="sm:max-w-xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => roleState.isLoading || branchState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="اسم المستخدم"
            required
            value={ formData.username || "" }
            onChange={ (e) => dispatch(UserSlice.formActions.updateFormData({ username: e.target.value })) }
            isInvalid={ isInvalid("username") }
            error={ getError("username") }
          />

          <PasswordField
            label="كلمة المرور"
            required
            value={ formData.password || "" }
            onChange={ (e) => dispatch(UserSlice.formActions.updateFormData({ password: e.target.value })) }
            isInvalid={ isInvalid("password") }
            error={ getError("password") }
          />
        </div>

        <FormField label="الدور" required isInvalid={ isInvalid("roleId") } error={ getError("roleId") }>
          <SearchableSelect
            items={ roleState.entities.data ?? [] }
            itemLabelKey="name"
            itemValueKey="id"
            placeholder="اختر الدور"
            value={ formData.roleId?.toString() || "" }
            columnsNames={ RoleFilterColumns.columnsNames }
            onSearch={ (condition) => dispatch(RoleSlice.entityActions.filter(condition)) }
            isInvalid={ isInvalid("roleId") }
            disabled={ roleState.isLoading }
            onValueChange={ (val) =>
            {
              const selected = roleState.entities.data?.find((r) => r.id.toString() === val);
              if (selected)
              {
                dispatch(UserSlice.formActions.updateFormData({ roleId: selected.id }));
                dispatch(UserSlice.formActions.updateFormData({ role: selected }));
              }
            } }
          />
        </FormField>

        <FormField label="الفرع" required isInvalid={ isInvalid("branchId") } error={ getError("branchId") }>
          <SearchableSelect
            items={ branchState.entities.data ?? [] }
            itemLabelKey="name"
            itemValueKey="id"
            placeholder="اختر الفرع"
            value={ formData.branchId?.toString() || "" }
            columnsNames={ RoleFilterColumns.columnsNames }
            onSearch={ (condition) => dispatch(BranchSlice.entityActions.filter(condition)) }
            isInvalid={ isInvalid("branchId") }
            disabled={ branchState.isLoading }
            onValueChange={ (val) =>
            {
              const selected = branchState.entities.data?.find((b) => b.id.toString() === val);
              if (selected)
              {
                dispatch(UserSlice.formActions.updateFormData({ branchId: selected.id }));
                dispatch(UserSlice.formActions.updateFormData({ branch: selected }));
              }
            } }
          />
        </FormField>

        <SelectField
          label="حالة المستخدم"
          value={ formData.isActive ? "active" : "inactive" }
          onValueChange={ (val) => dispatch(UserSlice.formActions.updateFormData({ isActive: val === "active" })) }
          required={ true }
          options={ [{ label: "نشط", value: "active" }, { label: "غير نشط", value: "inactive" }] }
        />
      </FieldGroup>
    </ChangeDialog>
  );
}
