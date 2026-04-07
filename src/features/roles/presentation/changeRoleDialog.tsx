import { type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, FieldGroup, Skeleton, TextField, useEntityForm } from "@yusr_systems/ui";
import { useEffect, useMemo } from "react";
import { SystemPermissionsResources } from "../../../core/auth/systemPermissionsResources";
import type { Role } from "../../../core/data/role";
import { fetchSystemPermissions } from "../../../core/state/shared/systemSlice";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";
import { categorizePermissions, PermissionCard } from "./permissionCard";
import { ActionIcons, ArabicLabels, PERMISSION_SECTIONS } from "./permissionConfig";
import { PermissionSkeleton } from "./permissionSkeleton";

export default function ChangeRoleDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<Role>)
{
  const validationRules: ValidationRule<Partial<Role>>[] = useMemo(
    () => [{ field: "name", selector: (d) => d.name, validators: [Validators.required("يرجى اختيار اسم للدور")] }],
    []
  );
  const { formData, handleChange, getError, isInvalid, validate, clearError } = useEntityForm<Role>(
    entity,
    validationRules
  );
  const systemState = useAppSelector((state) => state.system);
  const dispatch = useAppDispatch();

  useEffect(() =>
  {
    if (systemState.permissions.length === 0)
    {
      dispatch(fetchSystemPermissions());
    }
  }, [dispatch, systemState.permissions.length]);

  const categorized = useMemo(() =>
  {
    return PERMISSION_SECTIONS.map((section) => ({
      ...section,
      data: categorizePermissions(systemState.permissions, section.resources)
    }));
  }, [systemState.permissions]);

  return (
    <ChangeDialog<Role>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} دور` }
      className="sm:max-w-6xl max-h-[90vh] flex flex-col"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => systemState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <div className="flex-1 overflow-y-auto py-4 px-1">
        <FieldGroup className="space-y-8">
          <TextField
            label="اسم الدور"
            required
            value={ formData.name || "" }
            isInvalid={ isInvalid("name") }
            error={ getError("name") }
            onChange={ (e) =>
            {
              handleChange({ name: e.target.value });
              clearError("name");
            } }
          />

          { systemState.isLoading
            ? (
              <div className="space-y-8">
                <section className="space-y-4">
                  <Skeleton className="h-6 w-40" />
                  { PermissionSkeleton() }
                </section>
              </div>
            )
            : (
              <>
                { categorized.map((section) => (
                  <section key={ section.id } className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      { section.icon } <span>{ section.title }</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      { section.data.map((item) => (
                        <PermissionCard
                          key={ item.resource }
                          resourceId={ item.resource }
                          label={ ArabicLabels[item.resource] || item.resource }
                          masterPermission={ item.get }
                          isMasterRequired={ item.resource === SystemPermissionsResources.Settings }
                          selectedPermissions={ formData.permissions || [] }
                          onToggle={ (updated) => handleChange({ permissions: updated }) }
                          actions={ item.actions.map((perm) => ({
                            id: perm,
                            label: ArabicLabels[perm.split(":")[1]] || perm.split(":")[1],
                            icon: ActionIcons[perm.split(":")[1]]
                          })) }
                        />
                      )) }
                    </div>
                  </section>
                )) }
              </>
            ) }
        </FieldGroup>
      </div>
    </ChangeDialog>
  );
}
