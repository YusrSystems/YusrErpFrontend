import { FieldGroup, FieldsSection, FormField, SearchableSelect, SelectField, SelectInput, TextAreaField } from "@yusr_systems/ui";
import { InvoicePrintSize } from "../../core/data/setting";
import { TaxFilterColumns } from "../../core/data/tax";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import { filterTaxes } from "../taxes/logic/taxSlice";
import { useSettingContext } from "./settingContext";

export default function InvoiceSection()
{
  const {
    formData,
    handleChange,
    isInvalid,
    getError,
    clearError
  } = useSettingContext();

  const dispatch = useAppDispatch();
  const currencyState = useAppSelector((state) => state.currency);
  const taxState = useAppSelector((state) => state.tax);

  return (
    <div className="space-y-10 animate-in fade-in">
      <FieldGroup>
        <FieldsSection title="إعدادات الفواتير والضرائب" columns={ 2 }>
          <FormField
            label="العملة الافتراضية"
            required
            isInvalid={ isInvalid("currencyId") }
            error={ getError("currencyId") }
          >
            <SelectInput
              value={ formData.currencyId?.toString() || "" }
              disabled={ currencyState.isLoading }
              isInvalid={ isInvalid("currencyId") }
              options={ currencyState.entities.data?.map((c) => ({ label: c.name, value: c.id.toString() }))
                || [] }
              onValueChange={ (val) =>
              {
                handleChange({ currencyId: Number(val) });
                clearError("currencyId");
              } }
            />
          </FormField>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">الضريبة الافتراضية</label>
            <SearchableSelect
              items={ taxState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              value={ formData.mainTaxId?.toString() || "" }
              onValueChange={ (val) => handleChange({ mainTaxId: Number(val) }) }
              columnsNames={ TaxFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(filterTaxes(condition)) }
              disabled={ taxState.isLoading }
            />
          </div>

          <SelectField
            label="حجم طباعة الفاتورة"
            value={ formData.invoicePrintSize?.toString() || InvoicePrintSize.A4.toString() }
            onValueChange={ (val) => handleChange({ invoicePrintSize: Number(val) as InvoicePrintSize }) }
            options={ [{ label: "ورق A4", value: InvoicePrintSize.A4.toString() }, {
              label: "طابعة حرارية (Thermal)",
              value: InvoicePrintSize.ThermalPrinter.toString()
            }] }
          />
        </FieldsSection>

        <FieldsSection columns={ 1 }>
          <TextAreaField
            label="سياسة الفواتير (تظهر أسفل الفاتورة)"
            value={ formData.invoicePolicy || "" }
            onChange={ (e) => handleChange({ invoicePolicy: e.target.value }) }
            rows={ 3 }
            placeholder="مثال: البضاعة المباعة لا ترد ولا تستبدل بعد 3 أيام..."
          />
        </FieldsSection>
      </FieldGroup>
    </div>
  );
}