import { Button, Checkbox, NumberField, SearchableSelect, TextField } from "@yusr_systems/ui";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { ItemTax } from "../../../core/data/item";
import { type Tax, TaxFilterColumns, TaxSlice } from "../../../core/data/tax";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";
import { useItemContext } from "../itemContext";

export default function TaxesSection()
{
  const dispatch = useAppDispatch();
  const taxState = useAppSelector((state) => state.tax);
  const { formData, handleChange, mode } = useItemContext();
  useEffect(() =>
  {
    if(mode === "create")
      handleTaxableChange(formData.taxable ?? false);
  }, [taxState.entities?.data]);

  const handleTaxableChange = (isTaxable: boolean) =>
  {
    if (isTaxable)
    {
      const primaryTaxes = (taxState.entities?.data || [])
        .filter((t: Tax) => t.isPrimary)
        .map(
          (t: Tax) =>
            ({
              taxId: t.id,
              taxName: t.name,
              taxPercentage: t.percentage
            }) as ItemTax
        );

      handleChange((prev) => ({
        ...prev,
        taxable: true,
        itemTaxes: primaryTaxes,
        exemptionReason: "",
        exemptionReasonCode: ""
      }));
    }
    else
    {
      handleChange((prev) => ({
        ...prev,
        taxable: false,
        itemTaxes: []
      }));
    }
  };

  const addTax = () => handleChange({ itemTaxes: [...(formData.itemTaxes || []), new ItemTax()] });
  const updateTax = (index: number, updates: Partial<ItemTax>) =>
  {
    const list = [...(formData.itemTaxes || [])];
    list[index] = { ...list[index], ...updates };
    handleChange({ itemTaxes: list });
  };
  const removeTax = (index: number) =>
  {
    const list = [...(formData.itemTaxes || [])];
    list.splice(index, 1);
    handleChange({ itemTaxes: list });
  };

  return (
    <div className="pt-6 border-t">
      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="taxable"
            checked={ formData.taxable || false }
            onCheckedChange={ (checked) => handleTaxableChange(checked as boolean) }
          />
          <label htmlFor="taxable" className="text-sm font-bold">
            خاضعة للضريبة
          </label>
        </div>

        { formData.taxable && (
          <Button type="button" size="sm" onClick={ addTax }>
            <Plus className="w-4 h-4 ml-2" /> إضافة ضريبة
          </Button>
        ) }
      </div>

      { !formData.taxable
        ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 bg-muted/10 p-4 rounded-lg border">
            <TextField
              label="رمز سبب الإعفاء"
              placeholder="أدخل رمز الإعفاء (مثال: VATEX-SA-29)"
              value={ formData.exemptionReasonCode || "" }
              onChange={ (e) =>
                handleChange((prev) => ({
                  ...prev,
                  exemptionReasonCode: e.target.value
                })) }
            />
            <TextField
              label="سبب الإعفاء"
              placeholder="أدخل سبب الإعفاء من الضريبة"
              value={ formData.exemptionReason || "" }
              onChange={ (e) =>
                handleChange((prev) => ({
                  ...prev,
                  exemptionReason: e.target.value
                })) }
            />
          </div>
        )
        : (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="bg-muted/20 rounded-lg border overflow-hidden">
              <table className="w-full text-sm text-right">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-3 w-16">الرقم</th>
                    <th className="p-3">الضريبة</th>
                    <th className="p-3 w-32">نسبة الضريبة (%)</th>
                    <th className="p-3 w-16 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  { formData.itemTaxes?.map((tax, index) =>
                  {
                    return (
                      <tr key={ index } className="border-t border-muted">
                        <td className="p-3 font-bold">{ index + 1 }</td>
                        <td className="p-3">
                          <SearchableSelect
                            items={ taxState.entities?.data || [] }
                            itemLabelKey="name"
                            itemValueKey="id"
                            placeholder="اختر الضريبة"
                            value={ tax.taxId?.toString() || "" }
                            columnsNames={ TaxFilterColumns.columnsNames }
                            onSearch={ (condition) => dispatch(TaxSlice.entityActions.filter(condition)) }
                            disabled={ taxState.isLoading }
                            onValueChange={ (val) =>
                            {
                              const selectedTax = taxState.entities?.data?.find(
                                (t: Tax) => t.id.toString() === val
                              );
                              if (selectedTax)
                              {
                                updateTax(index, {
                                  taxId: selectedTax.id,
                                  taxName: selectedTax.name,
                                  taxPercentage: selectedTax.percentage
                                });
                              }
                            } }
                          />
                        </td>
                        <td className="p-3">
                          <NumberField
                            label=""
                            value={ tax.taxPercentage || 0 }
                            disabled
                            onChange={ (val) => updateTax(index, { taxPercentage: val }) }
                          />
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={ `text-red-500 hover:text-red-700 hover:bg-red-100` }
                            onClick={ () => removeTax(index) }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  }) }
                </tbody>
              </table>
              { (!formData.itemTaxes || formData.itemTaxes.length === 0) && (
                <div className="p-4 text-center text-muted-foreground">
                  لا توجد ضرائب مضافة
                </div>
              ) }
            </div>
          </div>
        ) }
    </div>
  );
}
