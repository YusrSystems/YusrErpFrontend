import { FilterCondition } from "@yusr_systems/core";
import { cn, SearchableSelect } from "@yusr_systems/ui";
import { Lock, ScanBarcode, ShoppingCart, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ItemFilterColumns, ItemType, type StoreItem } from "../../core/data/item";
import { ItemTransfersItem, ItemUnitPricingMethodDto } from "../../core/data/itemTransfer";
import ItemsApiService from "../../core/networking/itemApiService";

interface TransferItemAdderProps
{
  fromStoreId?: number;
  value?: ItemTransfersItem[];
  onChange?: (items: ItemTransfersItem[]) => void;
}

export default function TransferItemAdder({ fromStoreId, value = [], onChange }: TransferItemAdderProps)
{
  const [barcode, setBarcode] = useState("");
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const itemsService = useMemo(() => new ItemsApiService(), []);

  const loadStoreItems = useCallback(
    async (condition?: FilterCondition) =>
    {
      if (!fromStoreId)
      {
        setStoreItems([]);
        return;
      }

      setIsLoading(true);
      try
      {
        const response = await itemsService.FilterStoreItems(
          1,
          50,
          ItemType.Product,
          fromStoreId,
          condition
        );

        if (response.status === 200 && response.data?.data)
        {
          setStoreItems(response.data.data);
        }
      }
      finally
      {
        setIsLoading(false);
      }
    },
    [fromStoreId, itemsService]
  );

  useEffect(() =>
  {
    loadStoreItems();
  }, [loadStoreItems]);

  const handleAddItem = useCallback(
    (storeItem: StoreItem, preSelectedMethodId?: number) =>
    {
      const methodsDto = storeItem.itemUnitPricingMethods?.map(
        (m) =>
          new ItemUnitPricingMethodDto({
            id: m.id,
            itemUnitPricingMethodName: m.itemUnitPricingMethodName,
            itemId: m.itemId,
            unitId: m.unitId,
            unitName: m.unitName,
            pricingMethodId: m.pricingMethodId,
            pricingMethodName: m.pricingMethodName,
            quantityMultiplier: m.quantityMultiplier,
            price: m.price,
            barcode: m.barcode
          })
      ) || [];

      const defaultMethod = methodsDto.find((m) => m.id === preSelectedMethodId) || methodsDto[0];

      const newItem = new ItemTransfersItem({
        id: Math.floor(Math.random() * 1000000),
        itemId: storeItem.item.id,
        itemName: storeItem.item.name,
        itemUnitPricingMethodId: defaultMethod?.id || 0,
        itemUnitPricingMethodName: defaultMethod?.itemUnitPricingMethodName || "غير محدد",
        quantity: 1,
        itemUnitPricingMethods: methodsDto
      });

      if (onChange)
      {
        onChange([...value, newItem]);
      }
    },
    [value, onChange]
  );

  const handleBarcodeKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) =>
  {
    if (e.key === "Enter" && barcode.trim() !== "")
    {
      e.preventDefault();

      if (!fromStoreId)
      {
        return;
      }

      setIsLoading(true);
      try
      {
        const response = await itemsService.GetByBarcode(barcode.trim(), fromStoreId);

        if (response.status === 200 && response.data?.storeItem)
        {
          handleAddItem(response.data.storeItem, response.data.selectedIupm?.id);
          setBarcode("");
        }
        else
        {
          alert("لم يتم العثور على الصنف بهذا الباركود في المستودع المحدد");
        }
      }
      finally
      {
        setIsLoading(false);
      }
    }
  };

  const updateRow = (id: number, updates: Partial<ItemTransfersItem>) =>
  {
    if (onChange)
    {
      onChange(
        value.map((row) => (row.id === id ? new ItemTransfersItem({ ...row, ...updates }) : row))
      );
    }
  };

  const removeRow = (id: number) =>
  {
    if (onChange)
    {
      onChange(value.filter((row) => row.id !== id));
    }
  };

  const dropdownItems = useMemo(() =>
  {
    return storeItems.map((si) => ({
      id: si.item.id,
      name: si.item.name,
      originalStoreItem: si
    }));
  }, [storeItems]);

  return (
    <div className="relative w-full" dir="rtl">
      { /* طبقة الحظر والضبابية إذا لم يتم اختيار المستودع */ }
      { !fromStoreId && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/30 backdrop-blur-[2px] rounded-lg border-2 border-dashed border-muted-foreground/30">
          <div className="bg-background px-6 py-3 rounded-full shadow-lg border border-border text-muted-foreground font-bold flex items-center gap-3">
            <Lock className="h-5 w-5 text-red-500" />
            يرجى اختيار "من مستودع" أولاً لإضافة المواد
          </div>
        </div>
      ) }

      { /* المحتوى الرئيسي (يصبح ضبابياً وغير قابل للنقر إذا لم يتم اختيار المستودع) */ }
      <div
        className={ cn(
          "flex flex-col gap-4 w-full transition-all duration-300",
          !fromStoreId && "opacity-60 pointer-events-none blur-[2px]"
        ) }
      >
        { /* 1. قسم إضافة المواد */ }
        <div className="flex items-center justify-start gap-6 p-4 rounded-lg border border-border bg-muted/10 shadow-sm">
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
              disabled={ isLoading }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
            />
            <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <div className="w-80">
            <SearchableSelect
              value={ "" }
              items={ dropdownItems }
              itemLabelKey="name"
              itemValueKey="id"
              placeholder="اختر مادة..."
              columnsNames={ ItemFilterColumns.columnsNames }
              onSearch={ (condition) => loadStoreItems(condition) }
              disabled={ isLoading }
              onValueChange={ (val) =>
              {
                const selected = dropdownItems.find((di) => di.id.toString() === val);
                if (selected)
                {
                  handleAddItem(selected.originalStoreItem);
                }
              } }
            />
          </div>
        </div>

        { /* 2. جدول المواد المحولة */ }
        <div className="w-full overflow-x-auto border border-border rounded-lg shadow-sm bg-background">
          <table className="w-full text-sm text-right">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="p-4 font-semibold w-16 text-center text-muted-foreground">الرقم</th>
                <th className="p-4 font-semibold">المادة</th>
                <th className="p-4 font-semibold text-center">طريقة التسعير والوحدة</th>
                <th className="p-4 font-semibold text-center w-32">الكمية</th>
                <th className="p-4 font-semibold w-16 text-center"></th>
              </tr>
            </thead>
            <tbody>
              { value.length === 0
                ? (
                  <tr>
                    <td colSpan={ 5 } className="p-10 text-center text-muted-foreground">
                      لا توجد مواد مضافة حالياً. استخدم الباركود أو القائمة المنسدلة لإضافة مواد.
                    </td>
                  </tr>
                )
                : (
                  value.map((row, index) => (
                    <tr
                      key={ row.id }
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4 text-center font-bold text-muted-foreground">{ index + 1 }</td>
                      <td className="p-4">
                        <div className="font-semibold text-foreground">{ row.itemName }</div>
                      </td>
                      <td className="p-4 text-center">
                        <select
                          value={ row.itemUnitPricingMethodId }
                          onChange={ (e) =>
                          {
                            const methodId = Number(e.target.value);
                            const method = row.itemUnitPricingMethods.find((m) => m.id === methodId);
                            updateRow(row.id, {
                              itemUnitPricingMethodId: methodId,
                              itemUnitPricingMethodName: method?.itemUnitPricingMethodName || ""
                            });
                          } }
                          className="h-10 w-full max-w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          { row.itemUnitPricingMethods?.map((m) => (
                            <option key={ m.id } value={ m.id }>
                              { m.pricingMethodName } - { m.unitName }
                            </option>
                          )) }
                          { (!row.itemUnitPricingMethods || row.itemUnitPricingMethods.length === 0) && (
                            <option value={ row.itemUnitPricingMethodId } disabled>
                              لا توجد طرق تسعير
                            </option>
                          ) }
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center">
                          <input
                            type="number"
                            min={ 1 }
                            value={ row.quantity || "" }
                            onChange={ (e) => updateRow(row.id, { quantity: Number(e.target.value) }) }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                  ))
                ) }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
