import { cn, SearchableSelect } from "@yusr_systems/ui";
import { ScanBarcode, ShoppingCart, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Item, { ItemFilterColumns, ItemSlice } from "../data/item";
import { useAppDispatch, useAppSelector } from "../state/store";

export interface ItemAdderRow
{
  id: string;
  item: Item;
  systemQuantity: number;
  actualQuantity: number;
  selectedUnitId: number;
}

interface ItemAdderProps
{
  value?: ItemAdderRow[];
  onChange?: (rows: ItemAdderRow[]) => void;
}

export default function ItemAdder({ value = [], onChange }: ItemAdderProps)
{
  const dispatch = useAppDispatch();
  const itemState = useAppSelector((state) => state.item);

  const [barcode, setBarcode] = useState("");
  const [rows, setRows] = useState<ItemAdderRow[]>(value);

  // جلب المواد عند تحميل المكون لتغذية القائمة المنسدلة والبحث بالباركود
  useEffect(() =>
  {
    dispatch(ItemSlice.entityActions.filter(undefined));
  }, [dispatch]);

  // تحديث المكون الأب عند تغير الصفوف
  useEffect(() =>
  {
    if (onChange)
    {
      onChange(rows);
    }
  }, [rows, onChange]);

  // دالة إضافة مادة جديدة للجدول
  const handleAddItem = useCallback((item: Item) =>
  {
    // اختيار الوحدة الافتراضية (أول وحدة تسعير أو وحدة البيع الأساسية)
    const defaultUnit = item.itemUnitPricingMethods?.[0]?.unitId || item.sellUnitId || 0;

    const newRow: ItemAdderRow = {
      id: Math.random().toString(36).substring(2, 9),
      item,
      systemQuantity: item.quantity || 0,
      actualQuantity: 0,
      selectedUnitId: defaultUnit
    };

    setRows((prev) => [...prev, newRow]);
  }, []);

  // معالجة إدخال الباركود
  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>
  {
    if (e.key === "Enter" && barcode.trim() !== "")
    {
      e.preventDefault();

      // البحث عن المادة بواسطة الباركود داخل وحدات التسعير
      const foundItem = itemState.entities.data?.find((i) =>
        i.itemUnitPricingMethods?.some((m) => m.barcode === barcode.trim())
      );

      if (foundItem)
      {
        handleAddItem(foundItem);
        setBarcode(""); // تفريغ الحقل بعد الإضافة الناجحة
      }
      else
      {
        // يمكن استبدالها بـ Toast Notification من إطار العمل
        alert("لم يتم العثور على الصنف بهذا الباركود");
      }
    }
  };

  // تحديث بيانات صف معين (الكمية أو الوحدة)
  const updateRow = (id: string, updates: Partial<ItemAdderRow>) =>
  {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...updates } : row)));
  };

  // حذف صف
  const removeRow = (id: string) =>
  {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <div className="flex flex-col gap-4 w-full" dir="rtl">
      { /* 1. قسم إضافة المواد (Add Item) */ }
      <div className="flex items-center justify-start gap-6 bg-muted/10 p-4 rounded-lg border border-border shadow-sm">
        <div className="flex items-center gap-2 font-bold text-lg text-foreground">
          <ShoppingCart className="h-5 w-5" />
          <span>إضافة مواد:</span>
        </div>

        <div className="relative w-64">
          <input
            type="text"
            placeholder="اقرأ الباركود..."
            value={ barcode }
            onChange={ (e) => setBarcode(e.target.value) }
            onKeyDown={ handleBarcodeKeyDown }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
          />
          <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="w-80">
          <SearchableSelect
            value={ "" }
            items={ itemState.entities.data ?? [] }
            itemLabelKey="name"
            itemValueKey="id"
            placeholder="اختر مادة..."
            columnsNames={ ItemFilterColumns.columnsNames }
            onSearch={ (condition) => dispatch(ItemSlice.entityActions.filter(condition)) }
            disabled={ itemState.isLoading }
            onValueChange={ (val) =>
            {
              const selected = itemState.entities.data?.find((i) => i.id.toString() === val);
              if (selected)
              {
                handleAddItem(selected);
              }
            } }
          />
        </div>
      </div>

      { /* 2. قسم عارض المواد (Item Viewer) */ }
      <div className="w-full overflow-x-auto border border-border rounded-lg shadow-sm bg-background">
        <table className="w-full text-sm text-right">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="p-4 font-semibold w-16 text-center text-muted-foreground">الرقم</th>
              <th className="p-4 font-semibold">
                <div className="flex items-center gap-2">
                  المادة
                  <span className="bg-red-500/10 text-red-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    إلزامي
                  </span>
                </div>
              </th>
              <th className="p-4 font-semibold text-center">
                الكمية في النظام (بالوحدة الأساسية)
              </th>
              <th className="p-4 font-semibold text-center">
                <div className="flex items-center justify-center gap-2">
                  الفرق (بالوحدة الأساسية)
                  <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    تلقائي
                  </span>
                </div>
              </th>
              <th className="p-4 font-semibold text-center">
                <div className="flex items-center justify-center gap-2">
                  الكمية الفعلية (الوحدات)
                  <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    تلقائي
                  </span>
                </div>
              </th>
              <th className="p-4 font-semibold w-16 text-center"></th>
            </tr>
          </thead>
          <tbody>
            { rows.length === 0
              ? (
                <tr>
                  <td colSpan={ 6 } className="p-10 text-center text-muted-foreground">
                    لا توجد مواد مضافة حالياً. استخدم الباركود أو القائمة المنسدلة لإضافة مواد.
                  </td>
                </tr>
              )
              : (
                rows.map((row, index) =>
                {
                  // حساب معامل التحويل للوحدة المختارة
                  const method = row.item.itemUnitPricingMethods?.find(
                    (m) => m.unitId === row.selectedUnitId
                  );
                  const multiplier = method?.quantityMultiplier || 1;

                  // حساب الفرق: (الكمية الفعلية * معامل التحويل) - الكمية في النظام
                  const difference = (row.actualQuantity * multiplier) - row.systemQuantity;

                  return (
                    <tr
                      key={ row.id }
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4 text-center font-bold text-muted-foreground">{ index + 1 }</td>

                      <td className="p-4">
                        <div className="font-semibold text-foreground">{ row.item.name }</div>
                        { row.item.class && (
                          <div className="text-xs text-muted-foreground mt-1">{ row.item.class }</div>
                        ) }
                      </td>

                      <td className="p-4 text-center">
                        <div className="bg-muted/30 p-2.5 rounded-md border border-border text-center font-medium">
                          { row.systemQuantity }
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <div
                          className={ cn(
                            "p-2.5 rounded-md border text-center font-bold tracking-wider",
                            difference > 0
                              ? "text-green-600 bg-green-500/10 border-green-500/20"
                              : difference < 0
                              ? "text-red-600 bg-red-500/10 border-red-500/20"
                              : "text-foreground bg-muted/30 border-border"
                          ) }
                        >
                          { difference > 0 ? `+${difference}` : difference }
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <select
                            value={ row.selectedUnitId }
                            onChange={ (e) => updateRow(row.id, { selectedUnitId: Number(e.target.value) }) }
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-w-[120px]"
                          >
                            { row.item.itemUnitPricingMethods?.map((m) => (
                              <option key={ m.unitId } value={ m.unitId }>
                                { m.unitName }
                              </option>
                            )) }
                            { /* في حال لم يكن هناك وحدات تسعير، نعرض الوحدة الأساسية */ }
                            { (!row.item.itemUnitPricingMethods || row.item.itemUnitPricingMethods.length === 0) && (
                              <option value={ row.item.sellUnitId }>
                                { row.item.sellUnitName || "الوحدة الأساسية" }
                              </option>
                            ) }
                          </select>

                          <input
                            type="number"
                            min={ 0 }
                            placeholder="-"
                            value={ row.actualQuantity || "" }
                            onChange={ (e) => updateRow(row.id, { actualQuantity: Number(e.target.value) }) }
                            className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm text-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={ () => removeRow(row.id) }
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded-md transition-colors"
                          aria-label="حذف المادة"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) }
          </tbody>
        </table>
      </div>
    </div>
  );
}
