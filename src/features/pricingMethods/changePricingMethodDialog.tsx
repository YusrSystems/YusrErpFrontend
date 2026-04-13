import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, FieldGroup, TextField, useFormErrors, useFormInit, useValidate } from "@yusr_systems/ui";
import { useMemo } from "react";
import type PricingMethod from "../../core/data/pricingMethod";
import { PricingMethodSlice, PricingMethodValidationRules } from "../../core/data/pricingMethod";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

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

  const dispatch = useAppDispatch();
  const { formData, errors } = useAppSelector((state) => state.pricingMethodForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    PricingMethodValidationRules.validationRules,
    (errors) => dispatch(PricingMethodSlice.formActions.setErrors(errors))
  );
  useFormInit(PricingMethodSlice.formActions.setInitialData, initialValues);

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
          onChange={ (e) => dispatch(PricingMethodSlice.formActions.updateFormData({ name: e.target.value })) }
          isInvalid={ isInvalid("name") }
          error={ getError("name") }
        />
      </FieldGroup>
    </ChangeDialog>
  );
}
