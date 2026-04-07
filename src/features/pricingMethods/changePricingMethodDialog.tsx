import { type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, FieldGroup, TextField, useEntityForm } from "@yusr_systems/ui";
import { useMemo } from "react";
import type PricingMethod from "../../core/data/pricingMethod";

export default function ChangePricingMethodDialog({
  entity,
  mode,
  service,
  onSuccess
}: CommonChangeDialogProps<PricingMethod>)
{
  const validationRules: ValidationRule<Partial<PricingMethod>>[] = useMemo(
    () => [{
      field: "pricingMethodName",
      selector: (d) => d.pricingMethodName,
      validators: [Validators.required("يرجى إدخال اسم طريقة التسعير")]
    }],
    []
  );

  const initialValues = useMemo(
    () => ({
      ...entity,
      pricingMethodName: entity?.pricingMethodName || ""
    }),
    [entity]
  );

  const { formData, handleChange, getError, isInvalid, validate } = useEntityForm<PricingMethod>(
    initialValues,
    validationRules
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
          value={ formData.pricingMethodName || "" }
          onChange={ (e) => handleChange({ pricingMethodName: e.target.value }) }
          isInvalid={ isInvalid("pricingMethodName") }
          error={ getError("pricingMethodName") }
        />
      </FieldGroup>
    </ChangeDialog>
  );
}
