import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, FieldGroup, TextField, useFormErrors, useFormInit, useValidate } from "@yusr_systems/ui";
import { useMemo } from "react";
import type Store from "../../core/data/store";
import { UnitSlice, UnitValidationRules } from "../../core/data/unit";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
export default function ChangeStoreDialog({
  entity,
  mode,
  service,
  onSuccess
}: CommonChangeDialogProps<Store>)
{
  const dispatch = useAppDispatch();
  const initialValues = useMemo(
    () => ({
      ...entity,
      storeName: entity?.name || ""
    }),
    [entity]
  );

  const { formData, errors } = useAppSelector((state) => state.unitForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    UnitValidationRules.validationRules,
    (errors) => dispatch(UnitSlice.formActions.setErrors(errors))
  );
  useFormInit(UnitSlice.formActions.setInitialData, initialValues);

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
          onChange={ (e) => dispatch(UnitSlice.formActions.updateFormData({ name: e.target.value })) }
          isInvalid={ isInvalid("name") }
          error={ getError("name") }
        />
      </FieldGroup>
    </ChangeDialog>
  );
}
