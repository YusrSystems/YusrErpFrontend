import { type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import {
  ChangeDialog,
  FieldGroup,
  FormField,
  NumberField,
  SearchableSelect,
  SelectField,
  TextField,
  useEntityForm,
} from "@yusr_systems/ui";
import { useEffect, useMemo } from "react";
import type PaymentMethod from "../../core/data/paymentMethod";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import { CommissionType } from "../../core/data/paymentMethod";
import { AccountFilterColumns, AccountSlice } from "../../core/data/account";

export default function ChangePaymentMethodDialog({
  entity,
  mode,
  service,
  onSuccess,
}: CommonChangeDialogProps<PaymentMethod>) {
  const dispatch = useAppDispatch();

  // جلب حالة الحسابات من الـ Store
  const accountState = useAppSelector((state) => state.account);

  const validationRules: ValidationRule<Partial<PaymentMethod>>[] = useMemo(
    () => [
      {
        field: "name",
        selector: (d) => d.name,
        validators: [Validators.required("يرجى إدخال اسم طريقة الدفع")],
      },
      {
        field: "accountId",
        selector: (d) => d.accountId,
        validators: [Validators.required("يرجى اختيار الحساب")],
      },
      {
        field: "commissionType",
        selector: (d) => d.commissionType,
        validators: [Validators.required("يرجى اختيار نوع العمولة")],
      },
      {
        field: "commissionAmount",
        selector: (d) => d.commissionAmount,
        validators: [Validators.required("يرجى إدخال قيمة العمولة")],
      },
    ],
    [],
  );

  const initialValues = useMemo(
    () => ({
      ...entity,
      name: entity?.name || "",
      accountId: entity?.accountId || undefined, // يفضل undefined للـ Select بدلاً من 0
      accountName: entity?.accountName || "",
      commissionType: entity?.commissionType || CommissionType.Percent,
      commissionAmount: entity?.commissionAmount || 0,
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
  } = useEntityForm<PaymentMethod>(initialValues, validationRules);

  // جلب قائمة الحسابات عند فتح النافذة
  useEffect(() => {
    dispatch(AccountSlice.entityActions.filter(undefined));
  }, [dispatch]);

  return (
    <ChangeDialog<PaymentMethod>
      title={`${mode === "create" ? "إضافة" : "تعديل"} طريقة دفع`}
      className="sm:max-w-xl"
      formData={formData}
      dialogMode={mode}
      service={service}
      // تعطيل زر الحفظ أثناء تحميل الحسابات
      disable={() => accountState.isLoading}
      onSuccess={(data) => onSuccess?.(data, mode)}
      validate={validate}
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="اسم طريقة الدفع"
            required
            value={formData.name || ""}
            onChange={(e) => handleChange({ name: e.target.value })}
            isInvalid={isInvalid("name")}
            error={getError("name")}
          />

          {/* استخدام SearchableSelect لاختيار الحساب */}
          <FormField
            label="الحساب"
            required
            isInvalid={isInvalid("accountId")}
            error={getError("accountId")}
          >
            <SearchableSelect
              items={accountState.entities.data ?? []}
              itemLabelKey="name"
              itemValueKey="id"
              placeholder="اختر الحساب"
              value={formData.accountId?.toString() || ""}
              columnsNames={AccountFilterColumns.columnsNames}
              onSearch={(condition) =>
                dispatch(AccountSlice.entityActions.filter(condition))
              }
              errorInputClass={errorInputClass("accountId")}
              disabled={accountState.isLoading}
              onValueChange={(val) => {
                const selected = accountState.entities.data?.find(
                  (a) => a.id.toString() === val,
                );
                if (selected) {
                  // تحديث الـ ID والاسم معاً
                  handleChange({
                    accountId: selected.id,
                    accountName: selected.name,
                  });
                }
              }}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="نوع العمولة"
            required
            value={
              formData.commissionType?.toString() ||
              CommissionType.Percent.toString()
            }
            onValueChange={(val) =>
              handleChange({ commissionType: Number(val) as CommissionType })
            }
            isInvalid={isInvalid("commissionType")}
            error={getError("commissionType")}
            options={[
              {
                label: "نسبة مئوية (%)",
                value: CommissionType.Percent.toString(),
              },
              { label: "مبلغ ثابت", value: CommissionType.Amount.toString() },
            ]}
          />

          <NumberField
            label="قيمة العمولة"
            required
            value={formData.commissionAmount || ""}
            onChange={(e) => handleChange({ commissionAmount: Number(e) })}
            isInvalid={isInvalid("commissionAmount")}
            error={getError("commissionAmount")}
          />
        </div>
      </FieldGroup>
    </ChangeDialog>
  );
}
