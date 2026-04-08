import { Button, type DialogMode, NumberField, SearchableSelect } from "@yusr_systems/ui";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { useMemo } from "react";
import { ItemType, ItemUnitPricingMethod, StoreItem } from "../../core/data/item";
import type { IStocktaking, IStocktakingItem } from "../../core/data/stocktaking";
import { useAppSelector } from "../../core/state/store";
import StoreItemSelector from "../items/storeItemSelector";

export interface StocktakingItemsTableProps
{
  formData: Partial<IStocktaking>;
  handleChange: (update: Partial<IStocktaking> | ((prev: Partial<IStocktaking>) => Partial<IStocktaking>)) => void;
  createInstance: () => IStocktakingItem;
  mode: DialogMode;
}

export default function StocktakingItemsTable(
  { formData, handleChange, createInstance, mode }: StocktakingItemsTableProps
)
{
  const storeItemsState = useAppSelector((state) => state.storeItems);

  const groupedItems = useMemo(() =>
  {
    const groups = new Map<number, IStocktakingItem[]>();
    formData.stocktakingItems?.forEach((item) =>
    {
      if (!groups.has(item.itemId))
      {
        groups.set(item.itemId, []);
      }
      groups.get(item.itemId)!.push(item);
    });
    return Array.from(groups.values());
  }, [formData.stocktakingItems]);

  const getSystemQuantity = (itemId: number) =>
  {
    const existingRow = formData.stocktakingItems?.find((i) => i.itemId === itemId);
    if (existingRow)
    {
      return existingRow.systemQuantity * (mode === "create" ? 1 : existingRow.quantityMultiplier);
    }
    return 0;
  };

  const getAvailableUnits = (itemId: number) =>
  {
    const storeItem = storeItemsState.storeItems.find((si) => si.item.id === itemId);
    const usedUnitIds =
      formData.stocktakingItems?.filter((i) => i.itemId === itemId).map((i) => i.itemUnitPricingMethodId) || [];
    return storeItem?.itemUnitPricingMethods?.filter((u) => !usedUnitIds.includes(u.id)) || [];
  };

  const getCalculatedActual = (group: IStocktakingItem[]) =>
  {
    return group.reduce((sum, item) => sum + ((item.actualQuantity || 0) * (item.quantityMultiplier || 1)), 0);
  };

  const getVariance = (group: IStocktakingItem[]) =>
  {
    const systemQty = getSystemQuantity(group[0]?.itemId);
    return getCalculatedActual(group) - systemQty;
  };

  const updateActualQuantity = (item: IStocktakingItem, newQty: number | undefined) =>
  {
    if (!newQty)
    {
      return;
    }

    const list = [...(formData.stocktakingItems || [])];
    const index = list.findIndex((i) =>
      i.itemId === item.itemId && i.itemUnitPricingMethodId === item.itemUnitPricingMethodId
    );
    if (index !== -1)
    {
      list[index] = { ...list[index], actualQuantity: newQty };
      const group = list.filter((i) => i.itemId === item.itemId);
      list[index].variance = getCalculatedActual(group) - getSystemQuantity(item.itemId);
      handleChange({ stocktakingItems: list });
    }
  };

  const removeUnit = (item: IStocktakingItem) =>
  {
    const list =
      formData.stocktakingItems?.filter((i) =>
        !(i.itemId === item.itemId && i.itemUnitPricingMethodId === item.itemUnitPricingMethodId)
      ) || [];
    handleChange({ stocktakingItems: list });
  };

  const removeEntireItem = (itemId: number) =>
  {
    const list = formData.stocktakingItems?.filter((i) => i.itemId !== itemId) || [];
    handleChange({ stocktakingItems: list });
  };

  const addUnitToItem = (itemId: number, unitIdStr: string) =>
  {
    const unitId = Number(unitIdStr);
    const storeItem = storeItemsState.storeItems.find((si) => si.item.id === itemId);
    const unitDetails = storeItem?.itemUnitPricingMethods?.find((u) => u.id === unitId);

    if (!storeItem || !unitDetails)
    {
      return;
    }

    const systemQty = getSystemQuantity(itemId);

    const newItem = createInstance();
    newItem.itemId = storeItem.item.id;
    newItem.itemName = storeItem.item.name;
    newItem.itemUnitPricingMethodId = unitDetails.id;
    newItem.itemUnitPricingMethodName = unitDetails.itemUnitPricingMethodName;
    newItem.quantityMultiplier = unitDetails.quantityMultiplier;
    newItem.systemQuantity = systemQty;
    newItem.actualQuantity = 0;
    newItem.variance = -systemQty;

    handleChange({ stocktakingItems: [...(formData.stocktakingItems || []), newItem] });
  };

  const handleStoreItemSelect = (storeItem: StoreItem, selectedIupm?: ItemUnitPricingMethod) =>
  {
    const item = storeItem.item;
    const unit = selectedIupm || storeItem.itemUnitPricingMethods?.[0];

    const list = [...(formData.stocktakingItems || [])];
    const existingIndex = list.findIndex(
      (i) => i.itemId === item.id && i.itemUnitPricingMethodId === unit.id
    );

    if (existingIndex !== -1)
    {
      const currentQty = list[existingIndex].actualQuantity || 0;
      list[existingIndex] = { ...list[existingIndex], actualQuantity: currentQty + 1 };
      const group = list.filter((i) => i.itemId === item.id);
      list[existingIndex].variance = getCalculatedActual(group) - getSystemQuantity(item.id);
      handleChange({ stocktakingItems: list });
    }
    else
    {
      // Brand new item — fall back to live store quantity
      const systemQty = storeItem.storeQuantity || 0;
      const initialActualQty = selectedIupm ? 1 : 0;

      const newItem = createInstance();
      newItem.itemId = item.id;
      newItem.itemName = item.name;
      newItem.itemUnitPricingMethodId = unit.id;
      newItem.itemUnitPricingMethodName = unit.itemUnitPricingMethodName;
      newItem.quantityMultiplier = unit.quantityMultiplier;
      newItem.systemQuantity = systemQty;
      newItem.actualQuantity = initialActualQty;
      newItem.variance = (initialActualQty * unit.quantityMultiplier) - systemQty;

      handleChange({ stocktakingItems: [...list, newItem] });
    }
  };

  return (
    <div>
      <div className="sticky top-0 z-10 pt-4 pb-2 bg-background">
        { mode === "create" && (
          <StoreItemSelector
            storeId={ formData.storeId }
            itemType={ ItemType.Product }
            onSelect={ handleStoreItemSelect }
          />
        ) }
      </div>

      { formData.stocktakingItems && formData.stocktakingItems.length > 0
        ? (
          <div className="bg-background rounded-lg border overflow-hidden">
            <table className="w-full text-sm text-right">
              <thead className="bg-muted/50 text-muted-foreground border-b">
                <tr>
                  <th className="p-3 w-12 text-center">#</th>
                  <th className="p-3 w-1/4">المادة</th>
                  <th className="p-3 w-1/6 text-center">الكمية في النظام (بالوحدة الأساسية)</th>
                  <th className="p-3 w-1/6 text-center">الفرق (بالوحدة الأساسية)</th>
                  <th className="p-3 w-1/4">الكمية الفعلية (الوحدات)</th>
                  <th className="p-3 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                { groupedItems.map((group, index) =>
                {
                  const itemId = group[0].itemId;
                  const systemQty = getSystemQuantity(itemId);
                  const variance = getVariance(group);
                  const availableUnits = getAvailableUnits(itemId);

                  return (
                    <tr key={ itemId } className="hover:bg-muted/10 transition-colors">
                      <td className="p-3 font-bold text-center align-top pt-5">{ index + 1 }</td>

                      <td className="p-3 align-top pt-5 font-semibold">
                        { group[0].itemName }
                      </td>

                      <td className="p-3 align-top pt-5 text-center font-mono">
                        { systemQty }
                      </td>

                      <td className="p-3 align-top pt-5 text-center">
                        <span
                          className={ `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                            variance < 0
                              ? "bg-red-100 text-red-800"
                              : variance > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }` }
                        >
                          { variance > 0 ? `+${variance}` : variance }
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex flex-col gap-2">
                          { group.map((item, j) => (
                            <div key={ j } className="flex gap-2 items-center">
                              <div className="bg-muted px-3 py-2 rounded-md text-xs font-medium w-24 truncate text-center border">
                                { item.itemUnitPricingMethodName }
                              </div>
                              <div className="flex-1">
                                <NumberField
                                  label=""
                                  value={ item.actualQuantity || 0 }
                                  onChange={ (val) => updateActualQuantity(item, val) }
                                  disabled={ mode === "update" }
                                />
                              </div>
                              { mode === "create" && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 shrink-0"
                                  onClick={ () => removeUnit(item) }
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              ) }
                            </div>
                          )) }

                          { mode === "create" && availableUnits.length > 0 && (
                            <div className="mt-1">
                              <SearchableSelect
                                items={ availableUnits }
                                itemLabelKey="itemUnitPricingMethodName"
                                itemValueKey="id"
                                placeholder="إضافة وحدة أخرى..."
                                value=""
                                onValueChange={ (val) => addUnitToItem(itemId, val) }
                                columnsNames={ [{ label: "الوحدة", value: "itemUnitPricingMethodName" }] }
                                onSearch={ () =>
                                {} }
                              />
                            </div>
                          ) }
                        </div>
                      </td>

                      { mode === "create" && (
                        <td className="p-3 text-center align-top pt-4">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-900 hover:bg-red-100"
                            onClick={ () => removeEntireItem(itemId) }
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </td>
                      ) }
                    </tr>
                  );
                }) }
              </tbody>
            </table>
          </div>
        )
        : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground bg-muted/5">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">لا توجد مواد مضافة</p>
            { mode === "create" && <p className="text-sm mt-2">استخدم شريط البحث بالأعلى لإضافة مواد للجرد</p> }
          </div>
        ) }
    </div>
  );
}
