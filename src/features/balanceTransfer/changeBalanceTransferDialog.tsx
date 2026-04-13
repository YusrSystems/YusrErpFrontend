import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, DateField, FieldGroup, FieldsSection, NumberField, SearchableSelect, TextAreaField, useReduxEntityForm } from "@yusr_systems/ui";
import { useEffect, useMemo } from "react";
import { AccountFilterColumns, BanksAndBoxesSlice } from "../../core/data/account";
import type BalanceTransfer from "../../core/data/balanceTransfer";
import { BalanceTransferSlice, BalanceTransferValidationRules } from "../../core/data/balanceTransfer";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangeBalanceTransferDialog(
  { entity, mode, service, onSuccess }: CommonChangeDialogProps<BalanceTransfer>
)
{
  const dispatch = useAppDispatch();
  const accountState = useAppSelector((state) => state.banksAndBoxes);

  const initialValues = useMemo(() => ({
    ...entity,
    date: entity?.date || new Date(),
    amount: entity?.amount || 0
  }), [entity]);

  const {
    formData,
    handleChange,
    validate,
    getError,
    errorInputClass,
    isInvalid
  } = useReduxEntityForm<BalanceTransfer>(
    BalanceTransferSlice.formActions,
    (state) => state.balanceTransferForm,
    BalanceTransferValidationRules.validationRules,
    initialValues
  );

  useEffect(() =>
  {
    dispatch(BanksAndBoxesSlice.entityActions.filter(undefined));
  }, [dispatch]);

  const availableFromAccounts = useMemo(() =>
  {
    return accountState.entities.data?.filter((a) => a.id !== formData.toAccountId) ?? [];
  }, [accountState.entities.data, formData.toAccountId]);

  const availableToAccounts = useMemo(() =>
  {
    return accountState.entities.data?.filter((a) => a.id !== formData.fromAccountId) ?? [];
  }, [accountState.entities.data, formData.fromAccountId]);

  return (
    <ChangeDialog<BalanceTransfer>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} تحويل رصيد` }
      className="sm:max-w-2xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => accountState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
        <FieldGroup>
          <FieldsSection title="تفاصيل التحويل" columns={ 2 }>
            <DateField
              label="تاريخ التحويل"
              required
              value={ formData.date ? new Date(formData.date) : undefined }
              onChange={ (date) => handleChange({ date: date }) }
              isInvalid={ isInvalid("date") }
              error={ getError("date") }
            />

            <NumberField
              label="المبلغ"
              required
              value={ formData.amount || 0 }
              onChange={ (val) => handleChange({ amount: val }) }
              isInvalid={ isInvalid("amount") }
              error={ getError("amount") }
            />
          </FieldsSection>

          <FieldsSection title="أطراف التحويل" columns={ 2 }>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium">
                من حساب <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                items={ availableFromAccounts }
                itemLabelKey="name"
                itemValueKey="id"
                placeholder="اختر الحساب المحول منه"
                value={ formData.fromAccountId?.toString() || "" }
                columnsNames={ AccountFilterColumns.columnsNames }
                onSearch={ (condition) => dispatch(BanksAndBoxesSlice.entityActions.filter(condition)) }
                disabled={ accountState.isLoading }
                errorInputClass={ errorInputClass("fromAccountId") }
                onValueChange={ (val) =>
                {
                  const selected = availableFromAccounts.find((a) => a.id.toString() === val);
                  handleChange({ fromAccountId: selected?.id, fromAccountName: selected?.name });
                } }
              />
              { isInvalid("fromAccountId") && (
                <span className="text-xs text-red-500">{ getError("fromAccountId") }</span>
              ) }
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium">
                إلى حساب <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                items={ availableToAccounts }
                itemLabelKey="name"
                itemValueKey="id"
                placeholder="اختر الحساب المحول إليه"
                value={ formData.toAccountId?.toString() || "" }
                columnsNames={ AccountFilterColumns.columnsNames }
                onSearch={ (condition) => dispatch(BanksAndBoxesSlice.entityActions.filter(condition)) }
                disabled={ accountState.isLoading }
                errorInputClass={ errorInputClass("toAccountId") }
                onValueChange={ (val) =>
                {
                  const selected = availableToAccounts.find((a) => a.id.toString() === val);
                  handleChange({ toAccountId: selected?.id, toAccountName: selected?.name });
                } }
              />
              { isInvalid("toAccountId") && <span className="text-xs text-red-500">{ getError("toAccountId") }</span> }
            </div>
          </FieldsSection>

          <FieldsSection title="معلومات إضافية" columns={ 1 }>
            <TextAreaField
              label="البيان / الوصف"
              value={ formData.description || "" }
              onChange={ (e) => handleChange({ description: e.target.value }) }
              rows={ 3 }
              placeholder="اكتب سبب التحويل أو أي ملاحظات أخرى..."
            />
          </FieldsSection>
        </FieldGroup>
      </div>
    </ChangeDialog>
  );
}
