import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, FieldGroup, TextField, useFormErrors, useFormInit, useValidate } from "@yusr_systems/ui";
import { useMemo } from "react";
import type Unit from "../../core/data/unit";
import { UnitSlice, UnitValidationRules } from "../../core/data/unit";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangeUnitDialog({
  entity,
  mode,
  service,
  onSuccess
}: CommonChangeDialogProps<Unit>)
{
  const dispatch = useAppDispatch();
  const initialValues = useMemo(() => ({ ...entity, name: entity?.name || "" }), [entity]);

  const { formData, errors } = useAppSelector((state) => state.unitForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    UnitValidationRules.validationRules,
    (errors) => dispatch(UnitSlice.formActions.setErrors(errors))
  );
  useFormInit(UnitSlice.formActions.setInitialData, initialValues);

  return (
    <ChangeDialog<Unit>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} وحدة` }
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
          label="اسم الوحدة"
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
