import { type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import {
  ChangeDialog,
  FieldGroup,
  SelectField,
  TextField,
  useEntityForm,
} from "@yusr_systems/ui";
import { useMemo } from "react";
import type Store from "../../../core/data/store";
import { useAppDispatch } from "../../../core/state/store";

export default function ChangeStoreDialog({
  entity,
  mode,
  service,
  onSuccess,
}: CommonChangeDialogProps<Store>) {
  const dispatch = useAppDispatch();

  const validationRules: ValidationRule<Partial<Store>>[] = useMemo(
    () => [
      {
        field: "storeName",
        selector: (d) => d.storeName,
        validators: [Validators.required("يرجى إدخال اسم المستودع")],
      },
    ],
    [],
  );

  const initialValues = useMemo(
    () => ({
      ...entity,
      storeName: entity?.storeName || "",
      authorized: entity?.authorized ?? true,
    }),
    [entity],
  );

  const {
    formData,
    handleChange,
    getError,
    isInvalid,
    validate,
    errorInputClass,
  } = useEntityForm<Store>(initialValues, validationRules);

  return (
    <ChangeDialog<Store>
      title={`${mode === "create" ? "إضافة" : "تعديل"} مستودع`}
      className="sm:max-w-md"
      formData={formData}
      dialogMode={mode}
      service={service}
      disable={() => false}
      onSuccess={(data) => onSuccess?.(data, mode)}
      validate={validate}
    >
      <FieldGroup>
        <TextField
          label="اسم المستودع"
          required
          value={formData.storeName || ""}
          onChange={(e) => handleChange({ storeName: e.target.value })}
          isInvalid={isInvalid("storeName")}
          error={getError("storeName")}
        />

        <SelectField
          label="حالة التصريح"
          value={formData.authorized ? "authorized" : "unauthorized"}
          onValueChange={(val) =>
            handleChange({ authorized: val === "authorized" })
          }
          required={true}
          options={[
            { label: "مصرح", value: "authorized" },
            { label: "غير مصرح", value: "unauthorized" },
          ]}
        />
      </FieldGroup>
    </ChangeDialog>
  );
}
