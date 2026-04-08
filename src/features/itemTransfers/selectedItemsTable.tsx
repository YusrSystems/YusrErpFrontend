import { cn, type DialogMode, InputField, SelectField } from "@yusr_systems/ui";
import { AlertCircle, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import { ItemTransferActions } from "./logic/itemTransferActions";

export default function SelectedItemsTable({ mode }: { mode: DialogMode; })
{
  const dispatch = useAppDispatch();
  const { items, errors } = useAppSelector((state) => state.itemTransferUI);

  if (items.length === 0)
  {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground border border-dashed border-border rounded-lg bg-background/50">
        <p>لا توجد مواد مضافة حالياً.</p>
        <p className="text-xs mt-1">قم باختيار مادة من القائمة أو باستخدام الباركود لإضافتها للجدول.</p>
        { errors["general"] && (
          <div className="flex items-center gap-1 text-red-500 mt-3 text-sm font-medium bg-red-500/10 px-3 py-1.5 rounded-md">
            <AlertCircle className="h-4 w-4" />
            { errors["general"] }
          </div>
        ) }
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border border-border rounded-lg shadow-sm bg-background" dir="rtl">
      <table className="w-full text-sm text-right">
        <thead className="bg-muted/40 border-b border-border">
          <tr>
            <th className="p-4 font-semibold w-16 text-center text-muted-foreground">الرقم</th>
            <th className="p-4 font-semibold">اسم المادة</th>
            <th className="p-4 font-semibold text-center w-72">طريقة التسعير والوحدة</th>
            <th className="p-4 font-semibold text-center w-40">الكمية</th>
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

              { /* العمود الأول: اسم المادة */ }
              <td className="p-4">
                <div className="font-semibold text-foreground">{ row.itemName }</div>
                { row.maxQuantity > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    المتوفر: { row.maxQuantity }
                  </div>
                ) }
              </td>

              { /* العمود الثاني: طريقة التسعير (Select) */ }
              <td className="p-4 text-center align-top">
                <SelectField
                  label=""
                  value={ row.selectedPricingMethodId?.toString() || "" }
                  onValueChange={ (val) => ItemTransferActions.updatePricingMethod(dispatch, row.id, Number(val)) }
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

              { /* العمود الثالث: الكمية (Number) */ }
              <td className="p-4 text-center align-top">
                <div className="flex flex-col items-center justify-center gap-1">
                  <InputField
                    label=""
                    min={ 1 }
                    value={ row.quantity || "" }
                    onChange={ (e) => ItemTransferActions.updateQuantity(dispatch, row.id, Number(e.target.value)) }
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

              { /* زر الحذف */ }
              <td className="p-4 text-center align-top pt-5">
                { mode === "create" && (
                  <button
                    type="button"
                    onClick={ () => ItemTransferActions.removeItem(dispatch, row.id) }
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
