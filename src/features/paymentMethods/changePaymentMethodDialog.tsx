import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, FieldGroup, FormField, NumberField, SearchableSelect, SelectField, TextField, useFormErrors, useFormInit, useValidate } from "@yusr_systems/ui";
import { useEffect, useMemo } from "react";
import { AccountFilterColumns, BanksAndBoxesSlice } from "../../core/data/account";
import type PaymentMethod from "../../core/data/paymentMethod";
import { CommissionType, PaymentMethodSlice, PaymentMethodValidationRules } from "../../core/data/paymentMethod";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangePaymentMethodDialog({
  entity,
  mode,
  service,
  onSuccess
}: CommonChangeDialogProps<PaymentMethod>)
{
  const dispatch = useAppDispatch();
  const accountState = useAppSelector((state) => state.banksAndBoxes);

  const initialValues = useMemo(
    () => ({
      ...entity,
      name: entity?.name || "",
      accountId: entity?.accountId || undefined,
      accountName: entity?.accountName || "",
      commissionType: entity?.commissionType || CommissionType.Percent,
      commissionAmount: entity?.commissionAmount || 0
    }),
    [entity]
  );

  const { formData, errors } = useAppSelector((state) => state.paymentMethodForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    PaymentMethodValidationRules.validationRules,
    (errors) => dispatch(PaymentMethodSlice.formActions.setErrors(errors))
  );
  useFormInit(PaymentMethodSlice.formActions.setInitialData, initialValues);

  useEffect(() =>
  {
    dispatch(BanksAndBoxesSlice.entityActions.filter());
  }, []);

  return (
    <ChangeDialog<PaymentMethod>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} طريقة دفع` }
      className="sm:max-w-xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => accountState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="اسم طريقة الدفع"
            required
            value={ formData.name || "" }
            onChange={ (e) => dispatch(PaymentMethodSlice.formActions.updateFormData({ name: e.target.value })) }
            isInvalid={ isInvalid("name") }
            error={ getError("name") }
          />

          <FormField
            label="الحساب المسؤول"
            required
            isInvalid={ isInvalid("accountId") }
            error={ getError("accountId") }
          >
            <SearchableSelect
              items={ accountState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              placeholder="اختر الحساب"
              value={ formData.accountId?.toString() || "" }
              columnsNames={ AccountFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(BanksAndBoxesSlice.entityActions.filter(condition)) }
              isInvalid={ isInvalid("accountId") }
              disabled={ accountState.isLoading }
              onValueChange={ (val) =>
              {
                const selected = accountState.entities.data?.find(
                  (a) => a.id.toString() === val
                );
                if (selected)
                {
                  dispatch(PaymentMethodSlice.formActions.updateFormData({
                    accountId: selected.id,
                    accountName: selected.name
                  }));
                }
              } }
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="نوع العمولة"
            required
            value={ formData.commissionType?.toString()
              || CommissionType.Percent.toString() }
            onValueChange={ (val) =>
              dispatch(
                PaymentMethodSlice.formActions.updateFormData({ commissionType: Number(val) as CommissionType })
              ) }
            isInvalid={ isInvalid("commissionType") }
            error={ getError("commissionType") }
            options={ [{
              label: "نسبة مئوية (%)",
              value: CommissionType.Percent.toString()
            }, { label: "مبلغ ثابت", value: CommissionType.Amount.toString() }] }
          />

          <NumberField
            label="قيمة العمولة"
            required
            value={ formData.commissionAmount || "" }
            onChange={ (e) => dispatch(PaymentMethodSlice.formActions.updateFormData({ commissionAmount: Number(e) })) }
            isInvalid={ isInvalid("commissionAmount") }
            error={ getError("commissionAmount") }
          />
        </div>
      </FieldGroup>
    </ChangeDialog>
  );
}
