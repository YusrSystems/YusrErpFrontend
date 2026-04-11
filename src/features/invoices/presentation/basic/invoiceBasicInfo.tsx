import { Checkbox, DateField, FieldsSection, FormField, SearchableSelect, SelectField, TextField } from "@yusr_systems/ui";
import Account, { AccountFilterColumns, ClientsAndSuppliersSlice } from "../../../../core/data/account";
import { ImportExportType, InvoiceType } from "../../../../core/data/invoice";
import { StoreFilterColumns } from "../../../../core/data/store";
import { useAppSelector } from "../../../../core/state/store";
import { filterStores } from "../../../stores/logic/storeSlice";
import { useInvoiceContext } from "../../logic/invoiceContext";
import { resetItems } from "../../logic/invoiceSliceUI";

export default function InvoiceBasicInfo()
{
  const {
    mode,
    formData,
    handleChange,
    isInvalid,
    getError,
    authState,
    dispatch
  } = useInvoiceContext();

  const accountState = useAppSelector((state) => state.clientsAndSuppliers);
  const storeState = useAppSelector((state) => state.store);
  let selectedAccount: Account | undefined = accountState.entities?.data?.find((account) =>
    account.id === formData.actionAccountId
  );

  const invoiceType = useAppSelector((state) => state.invoiceUI.type);

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
      return (formData.type === InvoiceType.Purchase && accountCountryId !== settingsCountryId);
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
      return (formData.type === InvoiceType.Sell && accountCountryId !== settingsCountryId);
    }
  };

  return (
    <FieldsSection title="البيانات الأساسية" columns={ { base: 1, md: 2, lg: 4 } }>
      { invoiceType === InvoiceType.Sell && (
        <SelectField
          label="نوع الفاتورة"
          required
          value={ formData.type?.toString() || "" }
          onValueChange={ (val) => handleChange({ type: Number(val) as InvoiceType }) }
          isInvalid={ isInvalid("type") }
          error={ getError("type") }
          disabled={ mode === "update" }
          options={ [{ label: "مبيعات", value: InvoiceType.Sell.toString() }, {
            label: "عرض سعر",
            value: InvoiceType.Quotation.toString()
          }] }
        />
      ) }

      { mode === "update" && (
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
          onChange={ (e) => handleChange({ date: e }) }
          isInvalid={ isInvalid("date") }
          error={ getError("date") }
        />
      ) }

      <FormField label="المستودع" required={ true } isInvalid={ isInvalid("storeId") } error={ getError("storeId") }>
        <SearchableSelect
          items={ storeState.entities.data ?? [] }
          itemLabelKey="storeName"
          itemValueKey="id"
          value={ formData.storeId?.toString() || "" }
          columnsNames={ StoreFilterColumns.columnsNames }
          onSearch={ (condition) => dispatch(filterStores(condition)) }
          disabled={ storeState.isLoading || mode === "update" }
          onValueChange={ (val) =>
          {
            const selected = storeState.entities.data?.find((a) => a.id.toString() === val);
            handleChange({ storeId: selected?.id, storeName: selected?.storeName, invoiceItems: [] });
            dispatch(resetItems());
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
          onSearch={ (condition) => dispatch(ClientsAndSuppliersSlice.entityActions.filter(condition)) }
          disabled={ accountState.isLoading || mode === "update" }
          onValueChange={ (val) =>
          {
            const selected = accountState.entities.data?.find((a) => a.id.toString() === val);
            selectedAccount = selected;
            handleChange({ actionAccountId: selected?.id, actionAccountName: selected?.name });
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
        onChange={ (e) => handleChange({ delegateEmp: e.target.value }) }
      />

      { canBeExportInvoice() && (
        <SelectField
          label="فاتورة استيراد"
          required
          value={ formData.importExportType?.toString() || "" }
          onValueChange={ (val) => handleChange({ importExportType: Number(val) as ImportExportType }) }
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
          onChange={ (e) => handleChange({ notes: e.target.value }) }
        />
      </div>
    </FieldsSection>
  );
}
