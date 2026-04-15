import { Checkbox, DateField, FieldsSection, FormField, SearchableSelect, SelectField, TextField } from "@yusr_systems/ui";
import { useEffect } from "react";
import Account, { AccountFilterColumns } from "../../../../core/data/account";
import { ImportExportType, InvoiceType } from "../../../../core/data/invoice";
import { StoreFilterColumns, StoreSlice } from "../../../../core/data/store";
import { useAppSelector } from "../../../../core/state/store";
import { useInvoiceContext } from "../../logic/invoiceContext";

export default function InvoiceBasicInfo()
{
  const {
    mode,
    formData,
    isInvalid,
    getError,
    slice,
    authState,
    dispatch,
    accountState,
    accountSlice
  } = useInvoiceContext();
  const storeState = useAppSelector((state) => state.store);
  let selectedAccount: Account | undefined = accountState.entities?.data?.find((account) =>
    account.id === formData.actionAccountId
  );

  const canBeExportInvoice = () =>
  {
    const accountCountryId: number | undefined = selectedAccount?.city?.countryId;
    const settingsCountryId: number | undefined = authState.setting?.branch?.city?.countryId;

    if (accountCountryId == undefined || settingsCountryId == undefined)
    {
      return false;
    }
    else
    {
      return ((formData.type === InvoiceType.Purchase || formData.type === InvoiceType.PurchaseReturn) && accountCountryId !== settingsCountryId);
    }
  };

  const canBeImportInvoice = () =>
  {
    const accountCountryId: number | undefined = selectedAccount?.city?.countryId;
    const settingsCountryId: number | undefined = authState.setting?.branch?.city?.countryId;

    if (accountCountryId == undefined || settingsCountryId == undefined)
    {
      return false;
    }
    else
    {
      return ((formData.type === InvoiceType.Sell || formData.type === InvoiceType.SellReturn || formData.type === InvoiceType.Quotation)
        && accountCountryId !== settingsCountryId);
    }
  };

  useEffect(() =>
  {
    if (canBeExportInvoice())
    {
      dispatch(
        slice.formActions.updateFormData({
          importExportType: ImportExportType.ImportAccordingToTheReverseChargeMechanism
        })
      );
    }
    else
    {
      dispatch(slice.formActions.updateFormData({ importExportType: undefined }));
    }
  }, [canBeExportInvoice()]);

  return (
    <FieldsSection title="البيانات الأساسية" columns={ { base: 1, md: 2, lg: 4 } }>
      { (formData.type === InvoiceType.Sell || formData.type === InvoiceType.Quotation) && (
        <SelectField
          label="نوع الفاتورة"
          required
          value={ formData.type?.toString() || "" }
          onValueChange={ (val) => dispatch(slice.formActions.updateFormData({ type: Number(val) as InvoiceType })) }
          isInvalid={ isInvalid("type") }
          error={ getError("type") }
          disabled={ mode === "update" || mode === "return" }
          options={ [{ label: "مبيعات", value: InvoiceType.Sell.toString() }, {
            label: "عرض سعر",
            value: InvoiceType.Quotation.toString()
          }] }
        />
      ) }

      { (mode === "update" || mode === "return") && (
        <TextField
          label="تاريخ الفاتورة"
          required
          value={ formData.date ? new Date(formData.date).toISOString().split("T")[0] : "" }
          isInvalid={ isInvalid("date") }
          error={ getError("date") }
          disabled
        />
      ) }

      { mode === "create" && (
        <DateField
          label="تاريخ الفاتورة"
          required
          value={ formData.date ? new Date(formData.date) : undefined }
          onChange={ (e) => dispatch(slice.formActions.updateFormData({ date: e })) }
          isInvalid={ isInvalid("date") }
          error={ getError("date") }
        />
      ) }

      <FormField label="المستودع" required={ true } isInvalid={ isInvalid("storeId") } error={ getError("storeId") }>
        <SearchableSelect
          items={ storeState.entities.data ?? [] }
          itemLabelKey="name"
          itemValueKey="id"
          value={ formData.storeId?.toString() || "" }
          columnsNames={ StoreFilterColumns.columnsNames }
          onSearch={ (condition) => dispatch(StoreSlice.entityActions.filter(condition)) }
          disabled={ storeState.isLoading || mode === "update" || mode === "return" }
          onValueChange={ (val) =>
          {
            const selected = storeState.entities.data?.find((a) => a.id.toString() === val);
            dispatch(
              slice.formActions.updateFormData({ storeId: selected?.id, storeName: selected?.name, invoiceItems: [] })
            );
          } }
        />
      </FormField>

      <FormField
        label="الحساب"
        required={ true }
        isInvalid={ isInvalid("actionAccountId") }
        error={ getError("actionAccountId") }
      >
        <SearchableSelect
          items={ accountState.entities.data ?? [] }
          itemLabelKey="name"
          itemValueKey="id"
          value={ formData.actionAccountId?.toString() || "" }
          columnsNames={ AccountFilterColumns.columnsNames }
          onSearch={ (condition) => dispatch(accountSlice.entityActions.filter(condition)) }
          disabled={ accountState.isLoading || mode === "update"|| mode === "return" }
          onValueChange={ (val) =>
          {
            const selected = accountState.entities.data?.find((a) => a.id.toString() === val);
            selectedAccount = selected;
            dispatch(
              slice.formActions.updateFormData({ actionAccountId: selected?.id, actionAccountName: selected?.name })
            );
          } }
        />
      </FormField>

      <TextField
        label="رقم الفاتورة المرتبطة"
        disabled
        value={ formData.originalInvoiceId || "" }
        onChange={ () =>
        {} }
      />

      <TextField
        label="الموظف المندوب"
        value={ formData.delegateEmp || "" }
        onChange={ (e) => dispatch(slice.formActions.updateFormData({ delegateEmp: e.target.value })) }
      />

      { canBeExportInvoice() && (
        <SelectField
          label="فاتورة استيراد"
          required
          value={ formData.importExportType?.toString() || "" }
          onValueChange={ (val) =>
            dispatch(slice.formActions.updateFormData({ importExportType: Number(val) as ImportExportType })) }
          isInvalid={ isInvalid("importExportType") }
          error={ getError("importExportType") }
          options={ [{ label: "استيراد وفق آلية الاحتساب العكسي", value: "2" }, {
            label: "استيراد خاضع للضريبة ومسدد للجمارك",
            value: "3"
          }] }
        />
      ) }

      { canBeImportInvoice() && (
        <div className="flex items-center gap-2 mt-6 border bg-primary/5 rounded-lg px-2">
          <Checkbox id="importInvoice" checked disabled />
          <label htmlFor="importInvoice" className="text-sm font-bold">
            فاتورة تصدير
          </label>
        </div>
      ) }

      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <TextField
          label="ملاحظات"
          value={ formData.notes || "" }
          onChange={ (e) => dispatch(slice.formActions.updateFormData({ notes: e.target.value })) }
        />
      </div>
    </FieldsSection>
  );
}
