import { type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { Button, ChangeDialog, FieldGroup, FieldsSection, NumberField, SearchableSelect, TextField, useEntityForm } from "@yusr_systems/ui";
import { Barcode, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { ItemFilterColumns, ItemSlice, ItemType } from "../../core/data/item";
import Stocktaking, { StocktakingItem } from "../../core/data/stocktaking";
import { StoreFilterColumns } from "../../core/data/store";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import StoreItemSelector from "../items/storeItemSelector";
import { filterStores } from "../stores/logic/storeSlice";

export default function ChangeStocktakingDialog(
  { entity, mode, service, onSuccess }: CommonChangeDialogProps<Stocktaking>
)
{
  const dispatch = useAppDispatch();
  const storeState = useAppSelector((state) => state.store);
  const itemState = useAppSelector((state) => state.item);

  const validationRules: ValidationRule<Partial<Stocktaking>>[] = useMemo(
    () => [
      { field: "storeId", selector: (d) => d.storeId, validators: [Validators.required("يرجى اختيار المستودع")] },
      { field: "date", selector: (d) => d.date, validators: [Validators.required("يرجى اختيار التاريخ")] }
    ],
    []
  );

  const initialValues = useMemo(() => ({
    ...entity,
    date: entity?.date ? new Date(entity.date) : new Date(),
    stocktakingItems: entity?.stocktakingItems || []
  }), [entity]);

  const { formData, handleChange, getError, isInvalid, validate, clearError } = useEntityForm<Stocktaking>(
    initialValues,
    validationRules
  );

  useEffect(() =>
  {
    dispatch(filterStores(undefined));
    dispatch(ItemSlice.entityActions.filter(undefined));
  }, [dispatch]);

  // --- منطق تجميع المواد (Grouping Logic) ---
  const groupedItems = useMemo(() =>
  {
    const groups = new Map<number, StocktakingItem[]>();
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

  const getCalculatedActual = (group: StocktakingItem[]) =>
  {
    return group.reduce((sum, item) => sum + ((item.actualQuantity || 0) * (item.quantityMultiplier || 1)), 0);
  };

  const getVariance = (group: StocktakingItem[]) =>
  {
    const systemQty = group[0]?.systemQuantity || 0;
    return getCalculatedActual(group) - systemQty;
  };

  // --- دوال إدارة البيانات ---
  const handleStoreChange = (val: string) =>
  {
    const selected = storeState.entities.data?.find((s) => s.id.toString() === val);
    handleChange({
      storeId: selected?.id,
      storeName: selected?.storeName,
      stocktakingItems: [] // تفريغ الجدول عند تغيير المستودع
    });
    clearError("storeId");
  };

  const handleAddItem = (val: string) =>
  {
    if (!formData.storeId)
    {
      alert("يرجى اختيار المستودع أولاً");
      return;
    }

    const selectedItem = itemState.entities.data?.find((i) => i.id.toString() === val);
    if (!selectedItem)
    {
      return;
    }

    if (formData.stocktakingItems?.some((i) => i.itemId === selectedItem.id))
    {
      return;
    }

    const storeQty = selectedItem.itemStores?.find((s) => s.storeId === formData.storeId)?.quantity || 0;
    const defaultUnit = selectedItem.itemUnitPricingMethods?.[0];

    if (!defaultUnit)
    {
      alert("هذه المادة لا تحتوي على وحدات تسعير");
      return;
    }

    const newItem = new StocktakingItem({
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      itemUnitPricingMethodId: defaultUnit.id,
      itemUnitPricingMethodName: defaultUnit.unitName || defaultUnit.itemUnitPricingMethodName,
      quantityMultiplier: defaultUnit.quantityMultiplier,
      systemQuantity: storeQty,
      actualQuantity: 0,
      variance: -storeQty
    });

    handleChange({ stocktakingItems: [...(formData.stocktakingItems || []), newItem] });
  };

  const updateActualQuantity = (item: StocktakingItem, newQty: number | undefined) =>
  {
    if (newQty === undefined)
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
      list[index].variance = (list[index].actualQuantity * list[index].quantityMultiplier) - list[index].systemQuantity;
      handleChange({ stocktakingItems: list });
    }
  };

  const removeUnit = (item: StocktakingItem) =>
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
    const selectedItem = itemState.entities.data?.find((i) => i.id === itemId);
    const unitDetails = selectedItem?.itemUnitPricingMethods?.find((u) => u.id === unitId);

    if (!selectedItem || !unitDetails)
    {
      return;
    }

    const existingGroup = groupedItems.find((g) => g[0].itemId === itemId);
    const systemQty = existingGroup?.[0]?.systemQuantity || 0;

    const newItem = new StocktakingItem({
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      itemUnitPricingMethodId: unitDetails.id,
      itemUnitPricingMethodName: unitDetails.unitName || unitDetails.itemUnitPricingMethodName,
      quantityMultiplier: unitDetails.quantityMultiplier,
      systemQuantity: systemQty,
      actualQuantity: 0,
      variance: -systemQty
    });

    handleChange({ stocktakingItems: [...(formData.stocktakingItems || []), newItem] });
  };

  const getAvailableUnits = (itemId: number) =>
  {
    const selectedItem = itemState.entities.data?.find((i) => i.id === itemId);
    const usedUnitIds =
      formData.stocktakingItems?.filter((i) => i.itemId === itemId).map((i) => i.itemUnitPricingMethodId) || [];
    return selectedItem?.itemUnitPricingMethods?.filter((u) => !usedUnitIds.includes(u.id)) || [];
  };

  return (
    <ChangeDialog<Stocktaking>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} جرد مواد` }
      className="sm:max-w-6xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => storeState.isLoading || itemState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
        <FieldGroup>
          <StoreItemSelector
            storeId={ formData.storeId }
            itemType={ ItemType.Product }
            onSelect={ (result) => console.log(result) }
          />

          <TextField
            label="تاريخ الجرد"
            required
            value={ formData.date ? new Date(formData.date).toISOString().split("T")[0] : undefined }
            isInvalid={ isInvalid("date") }
            error={ getError("date") }
            disabled
          />

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">
              المستودع <span className="text-red-500">*</span>
            </label>
            <SearchableSelect
              items={ storeState.entities.data ?? [] }
              itemLabelKey="storeName"
              itemValueKey="id"
              placeholder="اختر المستودع"
              value={ formData.storeId?.toString() || "" }
              onValueChange={ handleStoreChange }
              columnsNames={ StoreFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(filterStores(condition)) }
              disabled={ storeState.isLoading || mode === "update" }
            />
            { isInvalid("storeId") && <span className="text-xs text-red-500">{ getError("storeId") }</span> }
          </div>

          <TextField
            label="الوصف"
            value={ formData.description || "" }
            onChange={ (e) => handleChange({ description: e.target.value }) }
          />

          { /* 2. إضافة المواد (تظهر فقط بعد اختيار المستودع) */ }
          { formData.storeId && (
            <FieldsSection title="إضافة مواد للجرد" columns={ 1 }>
              <div className="flex flex-col md:flex-row gap-4 items-end bg-muted/20 p-4 rounded-lg border">
                <div className="w-full md:w-1/3 flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-muted-foreground">قراءة الباركود</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                      <Barcode className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="اقرأ الباركود هنا..."
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background pr-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center text-muted-foreground font-bold">أو</div>

                <div className="w-full md:flex-1 flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-muted-foreground">البحث بالاسم</label>
                  <SearchableSelect
                    items={ itemState.entities.data ?? [] }
                    itemLabelKey="name"
                    itemValueKey="id"
                    placeholder="ابحث عن مادة لإضافتها..."
                    value=""
                    onValueChange={ handleAddItem }
                    columnsNames={ ItemFilterColumns.columnsNames }
                    onSearch={ (condition) => dispatch(ItemSlice.entityActions.filter(condition)) }
                    disabled={ itemState.isLoading }
                  />
                </div>
              </div>
            </FieldsSection>
          ) }

          { /* 3. جدول المواد المجردة */ }
          { formData.storeId && (
            <FieldsSection title="المواد المجردة" columns={ 1 }>
              { formData.stocktakingItems && formData.stocktakingItems.length > 0
                ? (
                  <div className="bg-background rounded-lg border overflow-hidden">
                    <table className="w-full text-sm text-right">
                      <thead className="bg-muted/50 text-muted-foreground border-b">
                        <tr>
                          <th className="p-3 w-12 text-center">#</th>
                          <th className="p-3 w-1/4">المادة</th>
                          <th className="p-3 w-1/6 text-center">الكمية في النظام</th>
                          <th className="p-3 w-1/6 text-center">الفرق</th>
                          <th className="p-3 w-1/4">الكمية الفعلية (الوحدات)</th>
                          <th className="p-3 w-12 text-center">إجراء</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        { groupedItems.map((group, index) =>
                        {
                          const itemId = group[0].itemId;
                          const variance = getVariance(group);
                          const availableUnits = getAvailableUnits(itemId);

                          return (
                            <tr key={ itemId } className="hover:bg-muted/10 transition-colors">
                              <td className="p-3 font-bold text-center align-top pt-5">{ index + 1 }</td>

                              <td className="p-3 align-top pt-5 font-semibold">
                                { group[0].itemName }
                              </td>

                              <td className="p-3 align-top pt-5 text-center font-mono">
                                { group[0].systemQuantity }
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
                                        />
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 shrink-0"
                                        onClick={ () => removeUnit(item) }
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  )) }

                                  { availableUnits.length > 0 && (
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
                    <p className="text-sm mt-2">استخدم شريط البحث بالأعلى لإضافة مواد للجرد</p>
                  </div>
                ) }
            </FieldsSection>
          ) }
        </FieldGroup>
      </div>
    </ChangeDialog>
  );
}
