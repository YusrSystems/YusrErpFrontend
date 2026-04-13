import { type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, FieldGroup, FieldsSection, Loading, SearchableSelect, TextField, useEntityForm } from "@yusr_systems/ui";
import { useEffect, useMemo, useState } from "react";
import { ItemType } from "../../core/data/item";
import ItemsSettlement, { ItemsSettlementItem } from "../../core/data/itemsSettlement";
import type { IStocktaking } from "../../core/data/stocktaking";
import { StoreFilterColumns, StoreSlice } from "../../core/data/store";
import { fetchStoreItems } from "../../core/state/shared/storeItemsSlice";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import StocktakingItemsTable from "../stocktakings/stocktakingItemsTable";

export default function ChangeItemsSettlementDialog(
  { entity, mode, service, onSuccess }: CommonChangeDialogProps<ItemsSettlement>
)
{
  const dispatch = useAppDispatch();
  const [initLoading, setInitLoading] = useState(false);
  const storeState = useAppSelector((state) => state.store);

  const validationRules: ValidationRule<Partial<ItemsSettlement>>[] = useMemo(
    () => [
      { field: "storeId", selector: (d) => d.storeId, validators: [Validators.required("يرجى اختيار المستودع")] },
      { field: "date", selector: (d) => d.date, validators: [Validators.required("يرجى اختيار التاريخ")] }
    ],
    []
  );

  const initialValues = useMemo(() => ({
    ...entity,
    date: entity?.date ? new Date(entity.date) : new Date(),
    itemsSettlementItems: entity?.itemsSettlementItems || []
  }), [entity]);

  const { formData, handleChange, getError, isInvalid, validate, clearError } = useEntityForm<ItemsSettlement>(
    initialValues,
    validationRules
  );

  useEffect(() =>
  {
    dispatch(StoreSlice.entityActions.filter());
  }, [dispatch]);

  useEffect(() =>
  {
    if (formData.storeId)
    {
      dispatch(fetchStoreItems({
        pageNumber: 1,
        rowsPerPage: 100,
        itemType: ItemType.Product,
        storeId: formData.storeId,
        condition: undefined
      }));
    }
  }, [dispatch, formData.storeId]);

  useEffect(() =>
  {
    if (mode === "update" && entity?.id)
    {
      setInitLoading(true);
      const getItem = async () =>
      {
        const res = await service.Get(entity.id);
        handleChange({ ...res.data });
        setInitLoading(false);
      };
      getItem();
    }
  }, [entity?.id, mode]);

  const handleStoreChange = (val: string) =>
  {
    const selected = storeState.entities.data?.find((s) => s.id.toString() === val);
    handleChange({
      storeId: selected?.id,
      storeName: selected?.name,
      itemsSettlementItems: []
    });
    clearError("storeId");
  };

  // ==========================================
  // Adapter Logic (لربط الجدول بكيان التسوية)
  // ==========================================

  // 1. تجهيز البيانات للجدول بالاسم الذي يتوقعه (stocktakingItems)
  const tableFormData = useMemo(() => ({
    ...formData,
    stocktakingItems: formData.itemsSettlementItems
  }), [formData]);

  // 2. اعتراض التحديثات القادمة من الجدول وتحويلها للاسم الصحيح
  const handleTableChange = (update: any) =>
  {
    if (typeof update === "function")
    {
      // في حال تم تمرير دالة (Callback)
      handleChange((prev) =>
      {
        const mappedPrev = { ...prev, stocktakingItems: prev.itemsSettlementItems };
        const result = update(mappedPrev);
        if (result.stocktakingItems !== undefined)
        {
          return { ...prev, itemsSettlementItems: result.stocktakingItems as ItemsSettlementItem[] };
        }
        return { ...prev, ...result };
      });
    }
    else
    {
      // في حال تم تمرير كائن مباشر
      if (update.stocktakingItems !== undefined)
      {
        handleChange({ itemsSettlementItems: update.stocktakingItems as ItemsSettlementItem[] });
      }
      else
      {
        handleChange(update);
      }
    }
  };

  if (initLoading)
  {
    return (
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>
            { mode === "create" ? "إضافة" : "تعديل" } تسوية مواد
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Loading entityName="التسوية" />
      </DialogContent>
    );
  }

  return (
    <ChangeDialog<ItemsSettlement>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} تسوية مواد` }
      className="sm:max-w-6xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => storeState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
        <FieldGroup>
          <FieldsSection columns={ 2 }>
            <TextField
              label="تاريخ التسوية"
              required
              value={ formData.date ? new Date(formData.date).toISOString().split("T")[0] : "" }
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
                itemLabelKey="name"
                itemValueKey="id"
                placeholder="اختر المستودع"
                value={ formData.storeId?.toString() || "" }
                onValueChange={ handleStoreChange }
                columnsNames={ StoreFilterColumns.columnsNames }
                onSearch={ (condition) => dispatch(StoreSlice.entityActions.filter(condition)) }
                disabled={ storeState.isLoading || mode === "update" }
              />
              { isInvalid("storeId") && <span className="text-xs text-red-500">{ getError("storeId") }</span> }
            </div>
          </FieldsSection>

          <TextField
            label="الوصف"
            value={ formData.description || "" }
            onChange={ (e) => handleChange({ description: e.target.value }) }
          />

          { /* استدعاء الجدول المشترك مع تمرير الـ Adapter والـ Factory */ }
          { formData.storeId && (
            <StocktakingItemsTable
              formData={ tableFormData as Partial<IStocktaking> }
              handleChange={ handleTableChange }
              createInstance={ () => new ItemsSettlementItem() } // إنشاء كائن تسوية جديد
              mode={ mode }
            />
          ) }
        </FieldGroup>
      </div>
    </ChangeDialog>
  );
}
