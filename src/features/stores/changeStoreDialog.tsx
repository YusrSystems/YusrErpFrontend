import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, FieldGroup, TextField, useReduxEntityForm } from "@yusr_systems/ui";
import { useMemo } from "react";
import type Store from "../../core/data/store";
import { StoreSlice, StoreValidationRules } from "../../core/data/store";
export default function ChangeStoreDialog({
  entity,
  mode,
  service,
  onSuccess
}: CommonChangeDialogProps<Store>)
{
  const initialValues = useMemo(
    () => ({
      ...entity,
      storeName: entity?.name || ""
    }),
    [entity]
  );

  const {
    formData,
    handleChange,
    validate,
    getError,
    isInvalid
  } = useReduxEntityForm<Store>(
    StoreSlice.formActions,
    (state) => state.storeForm,
    StoreValidationRules.validationRules,
    initialValues
  );

  return (
    <ChangeDialog<Store>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} مستودع` }
      className="sm:max-w-md"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => false }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <FieldGroup>
        <TextField
          label="اسم المستودع"
          required
          value={ formData.name || "" }
          onChange={ (e) => handleChange({ name: e.target.value }) }
          isInvalid={ isInvalid("name") }
          error={ getError("name") }
        />
      </FieldGroup>
    </ChangeDialog>
  );
}
