import { DateField, FieldsSection, NumberField, SelectField } from "@yusr_systems/ui";
import { InvoiceType } from "../../core/data/invoice";
import { useInvoiceContext } from "./invoiceContext";

export default function InvoiceBasicInfo()
{
  const {
    mode,
    formData,
    handleChange,
    isInvalid,
    getError,
    clearError
  } = useInvoiceContext();

  return (
    <FieldsSection title="البيانات الأساسية" columns={ 5 } className="lg:grid-cols-3">
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
  );
}
