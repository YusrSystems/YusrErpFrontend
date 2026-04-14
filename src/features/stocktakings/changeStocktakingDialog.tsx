import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, FieldGroup, FieldsSection, Loading, SearchableSelect, TextField, useFormErrors, useFormInit, useValidate } from "@yusr_systems/ui";
import { useEffect, useMemo, useState } from "react";
import { FilterByTypeRequest } from "../../core/data/filterByTypeRequest";
import { ItemType } from "../../core/data/item";
import Stocktaking, { StocktakingItem, StocktakingSlice, StocktakingValidationRules } from "../../core/data/stocktaking";
import { StoreFilterColumns, StoreSlice } from "../../core/data/store";
import { fetchStoreItems } from "../../core/state/shared/storeItemsSlice";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import StocktakingItemsTable from "./stocktakingItemsTable";

export default function ChangeStocktakingDialog(
  { entity, mode, service, onSuccess }: CommonChangeDialogProps<Stocktaking>
)
{
  const dispatch = useAppDispatch();
  const [initLoading, setInitLoading] = useState(false);
  const storeState = useAppSelector((state) => state.store);

  const initialValues = useMemo(() => ({
    ...entity,
    date: entity?.date ? new Date(entity.date) : new Date(),
    stocktakingItems: entity?.stocktakingItems || []
  }), [entity]);

  const { formData, errors } = useAppSelector((state) => state.stocktakingForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    StocktakingValidationRules.validationRules,
    (errors) => dispatch(StocktakingSlice.formActions.setErrors(errors))
  );
  useFormInit(StocktakingSlice.formActions.setInitialData, initialValues);

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
        storeId: formData.storeId,
        request: new FilterByTypeRequest({ condition: undefined, types: [ItemType.Product] })
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
        if (res.data != undefined)
        {
          dispatch(StocktakingSlice.formActions.setInitialData(res.data));
        }
        setInitLoading(false);
      };
      getItem();
    }
  }, [entity?.id, mode]);

  const handleStoreChange = (val: string) =>
  {
    const selected = storeState.entities.data?.find((s) => s.id.toString() === val);
    dispatch(StocktakingSlice.formActions.updateFormData({
      storeId: selected?.id,
      storeName: selected?.name,
      stocktakingItems: []
    }));
    StocktakingSlice.formActions.clearError("storeId");
  };

  if (initLoading)
  {
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
            onChange={ (e) => dispatch(StocktakingSlice.formActions.updateFormData({ description: e.target.value })) }
          />

          { formData.storeId && (
            <StocktakingItemsTable
              formData={ formData }
              handleChange={ (update) =>
                dispatch(
                  StocktakingSlice.formActions.updateFormData(
                    update as Partial<Stocktaking> | ((prev: Partial<Stocktaking>) => Partial<Stocktaking>)
                  )
                ) }
              createInstance={ () => new StocktakingItem() }
              mode={ mode }
            />
          ) }
        </FieldGroup>
      </div>
    </ChangeDialog>
  );
}
