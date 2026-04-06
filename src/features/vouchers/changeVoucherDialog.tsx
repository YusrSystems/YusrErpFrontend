import { type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, DateField, FieldGroup, FieldsSection, NumberField, SearchableSelect, SelectField, TextAreaField, TextField, useEntityForm } from "@yusr_systems/ui";
import { useEffect, useMemo } from "react";
import { AccountFilterColumns, VoucherAccountsSlice } from "../../core/data/account";
import { CommissionType, PaymentMethodFilterColumns, PaymentMethodSlice } from "../../core/data/paymentMethod";
import Voucher, { VoucherType } from "../../core/data/voucher";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangeVoucherDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<Voucher>)
{
  const dispatch = useAppDispatch();
  const accountState = useAppSelector((state) => state.voucherAccounts);
  const paymentMethodState = useAppSelector((state) => state.paymentMethod);

  const validationRules: ValidationRule<Partial<Voucher>>[] = useMemo(
    () => [
      { field: "type", selector: (d) => d.type, validators: [Validators.required("يرجى اختيار نوع السند")] },
      { field: "date", selector: (d) => d.date, validators: [Validators.required("يرجى اختيار التاريخ")] },
      {
        field: "amount",
        selector: (d) =>
          d.amount,
        validators: [Validators.required("يرجى إدخال المبلغ")]
      },
      { field: "accountId", selector: (d) => d.accountId, validators: [Validators.required("يرجى اختيار الحساب")] },
      {
        field: "paymentMethodId",
        selector: (d) => d.paymentMethodId,
        validators: [Validators.required("يرجى اختيار طريقة الدفع")]
      }
    ],
    []
  );

  const initialValues = useMemo(() => ({
    type: entity?.type || VoucherType.Receipt,
    ...entity,
    date: entity?.date ? new Date(entity.date) : new Date(),
    amount: entity?.amount || 0,
    commissionAmount: entity?.commissionAmount || 0
  }), [entity]);

  const { formData, handleChange, getError, isInvalid, validate, errorInputClass } = useEntityForm<Voucher>(
    initialValues,
    validationRules
  );

  useEffect(() =>
  {
    dispatch(VoucherAccountsSlice.entityActions.filter(undefined));
    dispatch(PaymentMethodSlice.entityActions.filter(undefined));
  }, [dispatch]);

  // --- دوال تطبيق قواعد الأعمال (Business Rules) ---

  const calculateCommission = (amount: number | undefined, methodId?: number): number =>
  {
    if (!methodId || !amount)
    {
      return 0;
    }

    const method = paymentMethodState.entities.data?.find((m) => m.id === methodId);
    if (!method)
    {
      return 0;
    }

    // إذا كانت العمولة نسبة مئوية
    if (method.commissionType === CommissionType.Percent)
    {
      return (amount * (method.commissionAmount || 0)) / 100;
    }
    // إذا كانت العمولة مبلغاً ثابتاً
    else if (method.commissionType === CommissionType.Amount)
    {
      return method.commissionAmount || 0;
    }

    return 0;
  };

  const handleTypeChange = (val: string) =>
  {
    const newType = Number(val) as VoucherType;
    handleChange({
      type: newType,
      // تصفير المبلغ المستحق إذا تحول إلى سند قبض
      amountDue: newType === VoucherType.Payment ? formData.amountDue : undefined,
      // حساب العمولة فقط إذا كان سند قبض، وإلا 0
      commissionAmount: newType === VoucherType.Receipt
        ? calculateCommission(formData.amount, formData.paymentMethodId)
        : 0
    });
  };

  const handleAmountChange = (val: number | undefined) =>
  {
    handleChange({
      amount: val,
      // إعادة حساب العمولة إذا كان سند قبض
      commissionAmount: formData.type === VoucherType.Receipt ? calculateCommission(val, formData.paymentMethodId) : 0
    });
  };

  const handlePaymentMethodChange = (val: string) =>
  {
    const methodId = Number(val);
    const selected = paymentMethodState.entities.data?.find((m) => m.id === methodId);
    handleChange({
      paymentMethodId: methodId,
      paymentMethod: selected,
      // إعادة حساب العمولة بناءً على طريقة الدفع الجديدة
      commissionAmount: formData.type === VoucherType.Receipt ? calculateCommission(formData.amount, methodId) : 0
    });
  };

  const isPayment = formData.type === VoucherType.Payment;
  const isReceipt = formData.type === VoucherType.Receipt;

  return (
    <ChangeDialog<Voucher>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} سند` }
      className="sm:max-w-4xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => accountState.isLoading || paymentMethodState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
        <FieldGroup className="gap-10">
          <FieldsSection title="المعلومات الأساسية" columns={ 3 }>
            <SelectField
              label="نوع السند"
              required
              value={ formData.type?.toString() || "" }
              onValueChange={ handleTypeChange }
              isInvalid={ isInvalid("type") }
              error={ getError("type") }
              options={ [{ label: "سند قبض", value: VoucherType.Receipt.toString() }, {
                label: "سند صرف",
                value: VoucherType.Payment.toString()
              }] }
            />

            <DateField
              label="التاريخ"
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
              onChange={ handleAmountChange }
              isInvalid={ isInvalid("amount") }
              error={ getError("amount") }
            />
          </FieldsSection>

          <FieldsSection title="الحساب وطريقة الدفع" columns={ 2 }>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium">
                الحساب <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                items={ accountState.entities.data ?? [] }
                itemLabelKey="name"
                itemValueKey="id"
                placeholder="اختر الحساب"
                value={ formData.accountId?.toString() || "" }
                columnsNames={ AccountFilterColumns.columnsNames }
                onSearch={ (condition) => dispatch(VoucherAccountsSlice.entityActions.filter(condition)) }
                disabled={ accountState.isLoading }
                errorInputClass={ errorInputClass("accountId") }
                onValueChange={ (val) =>
                {
                  const selected = accountState.entities.data?.find((a) => a.id.toString() === val);
                  handleChange({ accountId: selected?.id, accountName: selected?.name });
                } }
              />
              { isInvalid("accountId") && <span className="text-xs text-red-500">{ getError("accountId") }</span> }
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium">
                طريقة الدفع <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                items={ paymentMethodState.entities.data ?? [] }
                itemLabelKey="name"
                itemValueKey="id"
                placeholder="اختر طريقة الدفع"
                value={ formData.paymentMethodId?.toString() || "" }
                columnsNames={ PaymentMethodFilterColumns.columnsNames }
                onSearch={ (condition) => dispatch(PaymentMethodSlice.entityActions.filter(condition)) }
                disabled={ paymentMethodState.isLoading }
                errorInputClass={ errorInputClass("paymentMethodId") }
                onValueChange={ handlePaymentMethodChange }
              />
              { isInvalid("paymentMethodId") && (
                <span className="text-xs text-red-500">{ getError("paymentMethodId") }</span>
              ) }
            </div>
          </FieldsSection>

          { /* 3. تفاصيل مالية إضافية (تعتمد على نوع السند) */ }
          <FieldsSection title="تفاصيل مالية" columns={ 2 }>
            { /* يظهر فقط في سند الصرف */ }
            { isPayment && (
              <NumberField
                label="المبلغ المستحق"
                value={ formData.amountDue || 0 }
                onChange={ (val) => handleChange({ amountDue: val }) }
              />
            ) }

            { /* يظهر فقط في سند القبض (للقراءة فقط) */ }
            { isReceipt && (
              <NumberField
                label="مبلغ العمولة (محسوب تلقائياً)"
                value={ formData.commissionAmount || 0 }
                disabled={ true } // Read-only
                className="bg-muted"
              />
            ) }
          </FieldsSection>

          <FieldsSection title="معلومات الأطراف" columns={ 2 }>
            <TextField
              label={ "المعطي" }
              value={ formData.giver || "" }
              onChange={ (e) => handleChange({ giver: e.target.value }) }
            />
            <TextField
              label={ "المستلم" }
              value={ formData.recipient || "" }
              onChange={ (e) => handleChange({ recipient: e.target.value }) }
            />
            <TextField
              label="سبب الدفع / القبض"
              value={ formData.paymentReason || "" }
              onChange={ (e) => handleChange({ paymentReason: e.target.value }) }
            />
          </FieldsSection>

          { /* 5. الفاتورة المرتبطة (للقراءة فقط إذا وجدت) */ }
          { formData.invoiceId && (
            <FieldsSection title="ارتباطات النظام" columns={ 1 }>
              <TextField
                label="رقم الفاتورة المرتبطة"
                value={ `#${formData.invoiceId}` }
                disabled={ true }
                className="bg-muted w-1/2"
              />
            </FieldsSection>
          ) }

          { /* 6. نصوص وملاحظات */ }
          <FieldsSection title="البيان والملاحظات" columns={ 1 }>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextAreaField
                label="البيان"
                value={ formData.description || "" }
                onChange={ (e) => handleChange({ description: e.target.value }) }
                rows={ 3 }
              />
              <TextAreaField
                label="ملاحظات إضافية"
                value={ formData.notes || "" }
                onChange={ (e) => handleChange({ notes: e.target.value }) }
                rows={ 3 }
              />
            </div>
          </FieldsSection>
        </FieldGroup>
      </div>
    </ChangeDialog>
  );
}
