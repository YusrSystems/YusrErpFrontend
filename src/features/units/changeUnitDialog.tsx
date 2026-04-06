import { type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, FieldGroup, TextField, useEntityForm } from "@yusr_systems/ui";
import { useMemo } from "react";
import type Unit from "../../core/data/unit";

export default function ChangeUnitDialog({
  entity,
  mode,
  service,
  onSuccess
}: CommonChangeDialogProps<Unit>)
{
  const validationRules: ValidationRule<Partial<Unit>>[] = useMemo(
    () => [{
      field: "unitName",
      selector: (d) => d.unitName,
      validators: [Validators.required("يرجى إدخال اسم الوحدة")]
    }],
    []
  );

  const initialValues = useMemo(
    () => ({
      ...entity,
      unitName: entity?.unitName || ""
    }),
    [entity]
  );

  const {
    formData,
    handleChange,
    getError,
    isInvalid,
    validate
  } = useEntityForm<Unit>(initialValues, validationRules);

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
          value={ formData.unitName || "" }
          onChange={ (e) => handleChange({ unitName: e.target.value }) }
          isInvalid={ isInvalid("unitName") }
          error={ getError("unitName") }
        />
      </FieldGroup>
    </ChangeDialog>
  );
}
