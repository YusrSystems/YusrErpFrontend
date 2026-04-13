import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, FieldGroup, TextField, useReduxEntityForm } from "@yusr_systems/ui";
import { useMemo } from "react";
import type PricingMethod from "../../core/data/pricingMethod";
import { PricingMethodSlice, PricingMethodValidationRules } from "../../core/data/pricingMethod";

export default function ChangePricingMethodDialog({
  entity,
  mode,
  service,
  onSuccess
}: CommonChangeDialogProps<PricingMethod>)
{
  const initialValues = useMemo(
    () => ({
      ...entity,
      pricingMethodName: entity?.name || ""
    }),
    [entity]
  );

  const {
    formData,
    handleChange,
    validate,
    getError,
    isInvalid
  } = useReduxEntityForm<PricingMethod>(
    PricingMethodSlice.formActions,
    (state) => state.pricingMethodForm,
    PricingMethodValidationRules.validationRules,
    initialValues
  );

  return (
    <ChangeDialog<PricingMethod>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} طريقة تسعير` }
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
          label="اسم طريقة التسعير"
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
