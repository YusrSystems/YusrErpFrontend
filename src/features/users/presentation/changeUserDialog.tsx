import { useAppDispatch, useAppSelector } from "@/app/core/state/store";
import { type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, FieldGroup, FormField, PasswordField, SearchableSelect, SelectField, TextField, useEntityForm } from "@yusr_systems/ui";
import { useEffect, useMemo } from "react";
import { filterBranches } from "../../branches/logic/branchSlice";
import { RoleFilterColumns } from "../../roles/data/role";
import { filterRoles } from "../../roles/logic/roleSlice";
import type User from "../data/user";

export default function ChangeUserDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<User>)
{
  const roleState = useAppSelector((state) => state.role);
  const branchState = useAppSelector((state) => state.branch);
  const dispatch = useAppDispatch();
  const validationRules: ValidationRule<Partial<User>>[] = useMemo(
    () => [
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
    ],
    []
  );

  const initialValues = useMemo(() => ({ ...entity, password: "" }), [entity]);

  const { formData, handleChange, getError, isInvalid, validate, errorInputClass } = useEntityForm<User>(
    initialValues,
    validationRules
  );

  useEffect(() =>
  {
    dispatch(filterRoles(undefined));
    dispatch(filterBranches(undefined));
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
            onChange={ (e) => handleChange({ username: e.target.value }) }
            isInvalid={ isInvalid("username") }
            error={ getError("username") }
          />

          <PasswordField
            label="كلمة المرور"
            required
            value={ formData.password || "" }
            onChange={ (e) => handleChange({ password: e.target.value }) }
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
            onSearch={ (condition) => dispatch(filterRoles(condition)) }
            errorInputClass={ errorInputClass("roleId") }
            disabled={ roleState.isLoading }
            onValueChange={ (val) =>
            {
              const selected = roleState.entities.data?.find((r) => r.id.toString() === val);
              if (selected)
              {
                handleChange({ roleId: selected.id });
                handleChange({ role: selected });
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
            onSearch={ (condition) => dispatch(filterBranches(condition)) }
            errorInputClass={ errorInputClass("branchId") }
            disabled={ branchState.isLoading }
            onValueChange={ (val) =>
            {
              const selected = branchState.entities.data?.find((b) => b.id.toString() === val);
              if (selected)
              {
                handleChange({ branchId: selected.id });
                handleChange({ branch: selected });
              }
            } }
          />
        </FormField>

        <SelectField
          label="حالة المستخدم"
          value={ formData.isActive ? "active" : "inactive" }
          onValueChange={ (val) => handleChange({ isActive: val === "active" }) }
          required={ true }
          options={ [{ label: "نشط", value: "active" }, { label: "غير نشط", value: "inactive" }] }
        />
      </FieldGroup>
    </ChangeDialog>
  );
}
