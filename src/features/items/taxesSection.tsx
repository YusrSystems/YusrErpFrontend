import {
  Button,
  NumberField,
  SearchableSelect,
  TextField,
} from "@yusr_systems/ui";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import type Item from "../../core/data/item";
import type { ItemTax } from "../../core/data/item";
import { TaxFilterColumns, type Tax } from "../../core/data/tax";
import { filterTaxes } from "../taxes/logic/taxSlice";

export type TaxesSectionProps = {
  handleChange: (
    update: Partial<Item> | ((prev: Partial<Item>) => Partial<Item>),
  ) => void;
  formData: Partial<Item>;
  addTax: () => void;
  updateTax: (index: number, field: keyof ItemTax, value: any) => void;
  removeTax: (index: number) => void;
};

export default function TaxesSection({
  handleChange,
  formData,
  addTax,
  updateTax,
  removeTax,
}: TaxesSectionProps) {
  const dispatch = useAppDispatch();
  const taxState = useAppSelector((state) => state.tax);

  // جلب الضرائب عند فتح المكون
  useEffect(() => {
    dispatch(filterTaxes(undefined));
  }, [dispatch]);

  const handleTaxableChange = (isTaxable: boolean) => {
    if (isTaxable) {
      const primaryTaxes = (taxState.entities?.data || [])
        .filter((t: Tax) => t.isPrimary)
        .map(
          (t: Tax) =>
            ({
              taxId: t.id,
              taxName: t.name,
              taxPercentage: t.percentage,
            }) as ItemTax,
        );

      handleChange((prev) => ({
        ...prev,
        taxable: true,
        itemTaxes: primaryTaxes,
        exemptionReason: "",
        exemptionReasonCode: "",
      }));
    } else {
      handleChange((prev) => ({
        ...prev,
        taxable: false,
        itemTaxes: [],
      }));
    }
  };

  const isPrimaryTax = (taxId?: number) => {
    if (!taxId) return false;
    const originalTax = taxState.entities?.data?.find(
      (t: Tax) => t.id === taxId,
    );
    return originalTax?.isPrimary === true;
  };

  return (
    <div className="pt-6 border-t">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="taxable"
          checked={formData.taxable || false}
          onChange={(e) => handleTaxableChange(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="taxable" className="text-sm font-bold">
          خاضعة للضريبة
        </label>
      </div>

      {!formData.taxable ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 bg-muted/10 p-4 rounded-lg border">
          <TextField
            label="كود سبب الإعفاء"
            placeholder="أدخل كود الإعفاء (مثال: VATEX-SA-29)"
            value={formData.exemptionReasonCode || ""}
            onChange={(e) =>
              handleChange((prev) => ({
                ...prev,
                exemptionReasonCode: e.target.value,
              }))
            }
          />
          <TextField
            label="سبب الإعفاء"
            placeholder="أدخل سبب الإعفاء من الضريبة"
            value={formData.exemptionReason || ""}
            onChange={(e) =>
              handleChange((prev) => ({
                ...prev,
                exemptionReason: e.target.value,
              }))
            }
          />
        </div>
      ) : (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
          <Button
            type="button"
            size="sm"
            onClick={addTax}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 ml-2" /> إضافة ضريبة
          </Button>

          <div className="bg-muted/20 rounded-lg border overflow-hidden">
            <table className="w-full text-sm text-right">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="p-3 w-16">الرقم</th>
                  <th className="p-3">الضريبة</th>
                  <th className="p-3 w-32">نسبة الضريبة (%)</th>
                  <th className="p-3 w-16 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {formData.itemTaxes?.map((tax, index) => {
                  const isPrimary = isPrimaryTax(tax.taxId);

                  return (
                    <tr key={index} className="border-t border-muted">
                      <td className="p-3 font-bold">{index + 1}</td>
                      <td className="p-3">
                        <SearchableSelect
                          items={taxState.entities?.data || []}
                          itemLabelKey="name"
                          itemValueKey="id"
                          placeholder="اختر الضريبة"
                          value={tax.taxId?.toString() || ""}
                          columnsNames={TaxFilterColumns.columnsNames}
                          onSearch={(condition) =>
                            dispatch(filterTaxes(condition))
                          }
                          disabled={taxState.isLoading || isPrimary}
                          onValueChange={(val) => {
                            const selectedTax = taxState.entities?.data?.find(
                              (t: Tax) => t.id.toString() === val,
                            );
                            if (selectedTax) {
                              updateTax(index, "taxId", selectedTax.id);
                              updateTax(index, "taxName", selectedTax.name);
                              updateTax(
                                index,
                                "taxPercentage",
                                selectedTax.percentage,
                              );
                            }
                          }}
                        />
                      </td>
                      <td className="p-3">
                        <NumberField
                          label=""
                          value={tax.taxPercentage || 0}
                          disabled={isPrimary}
                          onChange={(val) =>
                            updateTax(index, "taxPercentage", val)
                          }
                        />
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={isPrimary}
                          className={`text-red-500 hover:text-red-700 hover:bg-red-100 ${
                            isPrimary ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() => removeTax(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(!formData.itemTaxes || formData.itemTaxes.length === 0) && (
              <div className="p-4 text-center text-muted-foreground">
                لا توجد ضرائب مضافة
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
