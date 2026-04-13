import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, FieldGroup, NumberField, SelectField, TextField, useFormErrors, useFormInit, useValidate } from "@yusr_systems/ui";
import { useMemo } from "react";
import { type Tax, TaxSlice, TaxValidationRules } from "../../core/data/tax";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangeTaxDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<Tax>)
{
  const dispatch = useAppDispatch();
  const initialValues = useMemo(() => ({ isPrimary: false, ...entity }), [entity]);

  const { formData, errors } = useAppSelector((state) => state.taxForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    TaxValidationRules.validationRules,
    (errors) => dispatch(TaxSlice.formActions.setErrors(errors))
  );
  useFormInit(TaxSlice.formActions.setInitialData, initialValues);

  return (
    <ChangeDialog<Tax>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} ضريبة` }
      className="sm:max-w-lg"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="اسم الضريبة"
            required
            value={ formData.name || "" }
            onChange={ (e) => dispatch(TaxSlice.formActions.updateFormData({ name: e.target.value })) }
            isInvalid={ isInvalid("name") }
            error={ getError("name") }
          />

          <NumberField
            label="النسبة (%)"
            required
            min={ 0 }
            max={ 100 }
            value={ formData.percentage ?? "" }
            onChange={ (value) => dispatch(TaxSlice.formActions.updateFormData({ percentage: Number(value) })) }
            isInvalid={ isInvalid("percentage") }
            error={ getError("percentage") }
          />
        </div>

        <SelectField
          label="ضريبة أساسية؟"
          value={ formData.isPrimary ? "yes" : "no" }
          onValueChange={ (val) => dispatch(TaxSlice.formActions.updateFormData({ isPrimary: val === "yes" })) }
          required={ true }
          options={ [{ label: "نعم", value: "yes" }, { label: "لا", value: "no" }] }
        />
      </FieldGroup>
    </ChangeDialog>
  );
}
