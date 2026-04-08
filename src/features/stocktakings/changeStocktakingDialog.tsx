import { type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, FieldGroup, FieldsSection, Loading, SearchableSelect, TextField, useEntityForm } from "@yusr_systems/ui";
import { useEffect, useMemo, useState } from "react";
import { ItemType } from "../../core/data/item";
import Stocktaking from "../../core/data/stocktaking";
import { StoreFilterColumns } from "../../core/data/store";
import { fetchStoreItems } from "../../core/state/shared/storeItemsSlice";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import { filterStores } from "../stores/logic/storeSlice";
import StocktakingItemsTable from "./stocktakingItemsTable";

export default function ChangeStocktakingDialog(
  { entity, mode, service, onSuccess }: CommonChangeDialogProps<Stocktaking>
)
{
  const dispatch = useAppDispatch();
  const [initLoading, setInitLoading] = useState(false);
  const storeState = useAppSelector((state) => state.store);
  
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

  useEffect(() => {
    dispatch(filterStores(undefined));
  }, [dispatch]);

  useEffect(() => {
    if (formData.storeId) {
      dispatch(fetchStoreItems({
        pageNumber: 1,
        rowsPerPage: 100,
        itemType: ItemType.Product,
        storeId: formData.storeId,
        condition: undefined
      }));
    }
  }, [dispatch, formData.storeId]);

  useEffect(() => {
    if (mode === "update" && entity?.id) {
      setInitLoading(true);
      const getItem = async () => {
        const res = await service.Get(entity.id);
        handleChange({ ...res.data });
        setInitLoading(false);
      };
      getItem();
    }
  }, [entity?.id, mode]);

  const handleStoreChange = (val: string) => {
    const selected = storeState.entities.data?.find((s) => s.id.toString() === val);
    handleChange({
      storeId: selected?.id,
      storeName: selected?.storeName,
      stocktakingItems: []
    });
    clearError("storeId");
  };

  if (initLoading) {
    return (
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>
            { mode === "create" ? "إضافة" : "تعديل" } جرد مواد
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Loading entityName="المادة" />
      </DialogContent>
    );
  }

  return (
    <ChangeDialog<Stocktaking>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} جرد مواد` }
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
              label="تاريخ الجرد"
              required
              // تم التعديل هنا لضمان عرض التاريخ بشكل صحيح دائماً
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
          </FieldsSection>

          <TextField
            label="الوصف"
            value={ formData.description || "" }
            onChange={ (e) => handleChange({ description: e.target.value }) }
          />

          { formData.storeId && <StocktakingItemsTable formData={ formData } handleChange={ handleChange } mode={ mode } /> }
        </FieldGroup>
      </div>
    </ChangeDialog>
  );
}