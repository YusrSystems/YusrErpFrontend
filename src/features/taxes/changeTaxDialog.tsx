import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, FieldGroup, NumberField, SelectField, TextField, useReduxEntityForm } from "@yusr_systems/ui";
import { useMemo } from "react";
import { type Tax, TaxSlice, TaxValidationRules } from "../../core/data/tax";

export default function ChangeTaxDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<Tax>)
{
  const initialValues = useMemo(() => ({ isPrimary: false, ...entity }), [entity]);

  const {
    formData,
    handleChange,
    validate,
    getError,
    isInvalid
  } = useReduxEntityForm<Tax>(
    TaxSlice.formActions,
    (state) => state.taxForm,
    TaxValidationRules.validationRules,
    initialValues
  );

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
            onChange={ (e) => handleChange({ name: e.target.value }) }
            isInvalid={ isInvalid("name") }
            error={ getError("name") }
          />

          <NumberField
            label="النسبة (%)"
            required
            min={ 0 }
            max={ 100 }
            value={ formData.percentage ?? "" }
            onChange={ (value) => handleChange({ percentage: Number(value) }) }
            isInvalid={ isInvalid("percentage") }
            error={ getError("percentage") }
          />
        </div>

        <SelectField
          label="ضريبة أساسية؟"
          value={ formData.isPrimary ? "yes" : "no" }
          onValueChange={ (val) => handleChange({ isPrimary: val === "yes" }) }
          required={ true }
          options={ [{ label: "نعم", value: "yes" }, { label: "لا", value: "no" }] }
        />
      </FieldGroup>
    </ChangeDialog>
  );
}
