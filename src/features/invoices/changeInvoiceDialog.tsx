import { type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, DateField, FieldsSection, NumberField, SelectField, TextAreaField, TextField, useEntityForm } from "@yusr_systems/ui";
import { useMemo } from "react";
import type Invoice from "../../core/data/invoice";
import { ImportExportType, InvoiceStatus, InvoiceType } from "../../core/data/invoice";

export default function ChangeInvoiceDialog({
  entity,
  mode,
  service,
  onSuccess
}: CommonChangeDialogProps<Invoice>)
{
  const validationRules: ValidationRule<Partial<Invoice>>[] = useMemo(
    () => [{
      field: "type",
      selector: (d) => d.type,
      validators: [Validators.required("يرجى اختيار نوع الفاتورة")]
    }, {
      field: "date",
      selector: (d) => d.date,
      validators: [Validators.required("يرجى إدخال تاريخ الفاتورة")]
    }, {
      field: "storeId",
      selector: (d) => d.storeId,
      validators: [Validators.required("يرجى تحديد المستودع")]
    }, {
      field: "actionAccountId",
      selector: (d) => d.actionAccountId,
      validators: [Validators.required("يرجى تحديد الحساب")]
    }],
    []
  );

  const initialValues = useMemo(
    () => ({
      ...entity,
      type: entity?.type ?? InvoiceType.Sell,
      statusId: entity?.statusId ?? InvoiceStatus.Valid,
      date: entity?.date
        ? new Date(entity.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      discountAmount: entity?.discountAmount ?? 0,
      addedAmount: entity?.addedAmount ?? 0,
      paidAmount: entity?.paidAmount ?? 0,
      fullAmount: entity?.fullAmount ?? 0
    }),
    [entity]
  );

  const { formData, handleChange, getError, isInvalid, validate } = useEntityForm<Invoice>(
    initialValues,
    validationRules
  );

  return (
    <ChangeDialog<Invoice>
      title={ `${mode === "create" ? "إنشاء" : "تعديل"} فاتورة` }
      className="sm:max-w-3xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => false }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <div className="flex flex-col gap-6">
        { /* Basic Information */ }
        <FieldsSection title="البيانات الأساسية" columns={ 2 }>
          <SelectField
            label="نوع الفاتورة"
            required
            value={ formData.type?.toString() || "" }
            onValueChange={ (val) => handleChange({ type: Number(val) as InvoiceType }) }
            isInvalid={ isInvalid("type") }
            error={ getError("type") }
            options={ [
              { label: "مبيعات", value: InvoiceType.Sell.toString() },
              { label: "مشتريات", value: InvoiceType.Purchase.toString() },
              {
                label: "مرتجع مبيعات",
                value: InvoiceType.SellReturn.toString()
              },
              { label: "عرض سعر", value: InvoiceType.Quotation.toString() },
              {
                label: "مرتجع مشتريات",
                value: InvoiceType.PurchaseReturn.toString()
              }
            ] }
          />

          <DateField
            label="تاريخ الفاتورة"
            required
            value={ formData.date ? new Date(formData.date) : undefined }
            onChange={ (e) => handleChange({ date: e }) }
            isInvalid={ isInvalid("date") }
            error={ getError("date") }
          />

          { /* Note: Replace NumberField with SearchableSelect linked to Store/Account slices if available */ }
          <NumberField
            label="رقم المستودع"
            required
            value={ formData.storeId || "" }
            onChange={ (e) => handleChange({ storeId: Number(e) }) }
            isInvalid={ isInvalid("storeId") }
            error={ getError("storeId") }
          />

          <NumberField
            label="رقم الحساب"
            required
            value={ formData.actionAccountId || "" }
            onChange={ (e) => handleChange({ actionAccountId: Number(e) }) }
            isInvalid={ isInvalid("actionAccountId") }
            error={ getError("actionAccountId") }
          />
        </FieldsSection>

        { /* Financial Details */ }
        <FieldsSection title="التفاصيل المالية" columns={ 3 }>
          <NumberField
            label="مبلغ الخصم"
            value={ formData.discountAmount || 0 }
            onChange={ (e) => handleChange({ discountAmount: Number(e) }) }
          />
          <NumberField
            label="المبلغ المضاف"
            value={ formData.addedAmount || 0 }
            onChange={ (e) => handleChange({ addedAmount: Number(e) }) }
          />
          <NumberField
            label="المبلغ المدفوع"
            value={ formData.paidAmount || 0 }
            onChange={ (e) => handleChange({ paidAmount: Number(e) }) }
          />
        </FieldsSection>

        { /* Additional Information */ }
        <FieldsSection title="معلومات إضافية" columns={ 2 }>
          <TextField
            label="المندوب"
            value={ formData.delegateEmp || "" }
            onChange={ (e) => handleChange({ delegateEmp: e.target.value }) }
          />

          <SelectField
            label="نوع الاستيراد / التصدير"
            value={ formData.importExportType?.toString() || "" }
            onValueChange={ (val) =>
              handleChange({
                importExportType: Number(val) as ImportExportType
              }) }
            options={ [{ label: "محلي", value: ImportExportType.Local.toString() }, {
              label: "تصدير",
              value: ImportExportType.Export.toString()
            }, {
              label: "استيراد (آلية الاحتساب العكسي)",
              value: ImportExportType.ImportAccordingToTheReverseChargeMechanism.toString()
            }, {
              label: "استيراد (مدفوع للجمارك)",
              value: ImportExportType.ImportPaidForCustoms.toString()
            }] }
          />

          <div className="col-span-2">
            <TextField
              label="السياسة / الشروط"
              value={ formData.policy || "" }
              onChange={ (e) => handleChange({ policy: e.target.value }) }
            />
          </div>

          <div className="col-span-2">
            <TextAreaField
              label="ملاحظات"
              value={ formData.notes || "" }
              onChange={ (e) => handleChange({ notes: e.target.value }) }
              rows={ 3 }
            />
          </div>
        </FieldsSection>
      </div>
    </ChangeDialog>
  );
}
