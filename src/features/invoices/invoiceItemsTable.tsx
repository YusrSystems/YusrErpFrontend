import { cn, InputField, SelectField, TextField } from "@yusr_systems/ui";
import { Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import { removeItem, updateItem } from "./logic/invoiceSliceUI";

export default function InvoiceItemsTable()
{
  const dispatch = useAppDispatch();
  const { items, errors, mode } = useAppSelector((state) => state.invoiceUI);
  return (
    <div className="w-full overflow-x-auto border border-border rounded-lg shadow-sm bg-background" dir="rtl">
      <table className="w-full text-sm text-right">
        <thead className="bg-muted/40 border-b border-border">
          <tr>
            <th className="p-3 font-semibold  w-16 text-center text-muted-foreground">الرقم</th>
            <th className="p-3 font-semibold">المادة</th>
            <th className="p-3 font-semibold text-center w-72">طريقة التسعير</th>
            <th className="p-3 font-semibold">التكلفة</th>
            <th className="p-3 font-semibold text-center w-40">الكمية</th>
            <th className="p-3 font-semibold">السعر بدون ضريبة</th>
            <th className="p-3 font-semibold">نسبة الضريبة</th>
            <th className="p-3 font-semibold">السعر بعد الضريبة</th>
            <th className="p-3 font-semibold">الخصم</th>
            <th className="p-3 font-semibold">التكلفة النهائية</th>
            <th className="p-3 font-semibold">السعر النهائي</th>
            <th className="p-4 font-semibold w-16 text-center"></th>
          </tr>
        </thead>
        <tbody>
          { items.map((row, index) => (
            <tr
              key={ row.id }
              className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
            >
              <td className="p-4 text-center font-bold text-muted-foreground">{ index + 1 }</td>

              <td className="p-4">
                <div className="font-semibold text-foreground">{ row.itemName }</div>
              </td>

              <td className="p-4 text-center align-top">
                <SelectField
                  label=""
                  value={ row.itemUnitPricingMethodId?.toString() || "" }
                  onValueChange={ (val: string) =>
                  {
                    dispatch(updateItem({
                      ...row,
                      itemUnitPricingMethodId: Number(val)
                    }));
                  } }
                  options={ row.itemUnitPricingMethods?.map((m) => ({
                    label: `${m.pricingMethodName || "بدون"} - ${m.unitName || "بدون"}`,
                    value: m.id.toString()
                  })) || [] }
                  placeholder="اختر طريقة التسعير"
                  isInvalid={ !!errors[`${row.id}_method`] }
                  disabled={ mode === "update" }
                />
                { errors[`${row.id}_method`] && (
                  <span className="text-xs text-red-500 mt-1 block animate-in fade-in">
                    { errors[`${row.id}_method`] }
                  </span>
                ) }
              </td>

              <td>
                <TextField label="" value={ row.price || "" } disabled />
              </td>

              <td className="p-4 text-center align-top">
                <div className="flex flex-col items-center justify-center gap-1">
                  <InputField
                    label=""
                    min={ 1 }
                    value={ row.quantity ?? 1 }
                    onChange={ (e) =>
                    {
                      dispatch(updateItem({ ...row, quantity: Number(e.target.value) }));
                    } }
                    disabled={ mode === "update" }
                    className={ cn(
                      "flex w-full rounded-md border bg-background px-3 py-2 text-sm text-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors",
                      errors[row.id] ? "border-red-500 focus-visible:ring-red-500" : "border-input"
                    ) }
                  />
                  { errors[row.id] && (
                    <span className="text-xs text-red-500 animate-in fade-in text-center">
                      { errors[row.id] }
                    </span>
                  ) }
                </div>
              </td>

              <td>
                <TextField label="" value={ row.cost || "" } disabled />
              </td>

              <td className="p-4">
                <TextField label="" value={ row.totalTaxesPerc || "" } disabled />
              </td>

              <td className="p-4">
                <TextField label="" value={ row.totalTaxesPerc || "" } disabled />
              </td>

              <td className="p-4">
                <TextField label="" value={ row.discount || "" } disabled />
              </td>

              <td className="p-4">
                <TextField label="" value={ row.totalPrice || "" } disabled />
              </td>

              <td className="p-4 text-center align-top pt-5">
                { mode === "create" && (
                  <button
                    type="button"
                    onClick={ () =>
                    {
                      dispatch(removeItem(row.id));
                    } }
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded-md transition-colors"
                    aria-label="حذف المادة"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                ) }
              </td>
            </tr>
          )) }
        </tbody>
      </table>
    </div>
  );
}
