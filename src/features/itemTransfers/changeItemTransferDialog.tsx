import { ChangeDialog, type CommonChangeDialogProps, DialogContent, DialogDescription, DialogHeader, DialogTitle, FieldGroup, FieldsSection, FormField, Loading, SearchableSelect, TextField, useReduxEntityForm } from "@yusr_systems/ui";
import { useEffect, useMemo, useState } from "react";
import { ItemType } from "../../core/data/item";
import ItemTransfer, { ItemTransfersItem, ItemTransferSlice, ItemTransferValidationRules } from "../../core/data/itemTransfer";
import { StoreFilterColumns, StoreSlice } from "../../core/data/store";
import { fetchStoreItems } from "../../core/state/shared/storeItemsSlice";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import StoreItemSelector from "../items/storeItemSelector";
import { ItemTransferActions } from "./logic/itemTransferActions";
import { initializeItems } from "./logic/itemTransferSlice";
import SelectedItemsTable from "./selectedItemsTable";

export default function ChangeItemTransferDialog({
  entity,
  mode,
  service,
  onSuccess
}: CommonChangeDialogProps<ItemTransfer>)
{
  const dispatch = useAppDispatch();
  const [initLoading, setInitLoading] = useState(false);
  const storeState = useAppSelector((state) => state.store);
  const { items } = useAppSelector((state) => state.itemTransferUI);

  const initialValues = useMemo(
    () => ({
      ...entity,
      transferDate: entity?.transferDate ? new Date(entity.transferDate) : new Date(),
      itemTransfersItems: entity?.itemTransfersItems || []
    }),
    [entity]
  );

  const {
    formData,
    handleChange,
    validate,
    getError,
    errorInputClass,
    isInvalid
  } = useReduxEntityForm<ItemTransfer>(
    ItemTransferSlice.formActions,
    (state) => state.taxForm,
    ItemTransferValidationRules.validationRules,
    initialValues
  );

  useEffect(() =>
  {
    if (mode === "update" && entity?.itemTransfersItems)
    {
      ItemTransferActions.initialize(dispatch, entity.itemTransfersItems);
    }
    return () =>
    {
      ItemTransferActions.clear(dispatch);
    };
  }, [dispatch, entity, mode]);

  useEffect(() =>
  {
    const mappedItems = items.map(
      (item) =>
        new ItemTransfersItem({
          id: isNaN(Number(item.id)) ? Math.floor(Math.random() * 1000000) : Number(item.id),
          itemId: item.itemId,
          itemName: item.itemName,
          itemUnitPricingMethodId: item.selectedPricingMethodId,
          itemUnitPricingMethodName: item.itemUnitPricingMethods.find((m) =>
            m.id === item.selectedPricingMethodId
          )?.itemUnitPricingMethodName || "",
          quantity: item.quantity,
          itemUnitPricingMethods: item.itemUnitPricingMethods as any
        })
    );
    handleChange({ itemTransfersItems: mappedItems });
  }, [items]);

  useEffect(() =>
  {
    if (mode === "update" && entity?.id)
    {
      setInitLoading(true);
      const getItem = async () =>
      {
        const res = await service.Get(entity.id);
        handleChange({ ...res.data });
        dispatch(initializeItems(res.data?.itemTransfersItems ?? []));
        setInitLoading(false);
      };
      getItem();
    }
  }, [entity?.id, mode]);

  const handleValidate = () =>
  {
    const isFormValid = validate();
    const isTableValid = ItemTransferActions.validate(dispatch, items);
    return isFormValid && isTableValid;
  };

  useEffect(() =>
  {
    if (formData.fromStoreId)
    {
      dispatch(fetchStoreItems({
        pageNumber: 1,
        rowsPerPage: 100,
        itemType: ItemType.Product,
        storeId: formData.fromStoreId,
        condition: undefined
      }));
    }
  }, [dispatch, formData.fromStoreId]);

  useEffect(() =>
  {
    dispatch(StoreSlice.entityActions.filter());
  }, [dispatch]);

  const availableFromStores = useMemo(() =>
  {
    if (!storeState.entities.data)
    {
      return [];
    }
    return storeState.entities.data.filter((s) => s.id !== formData.toStoreId);
  }, [storeState.entities.data, formData.toStoreId]);

  const availableToStores = useMemo(() =>
  {
    if (!storeState.entities.data)
    {
      return [];
    }
    return storeState.entities.data.filter((s) => s.id !== formData.fromStoreId);
  }, [storeState.entities.data, formData.fromStoreId]);

  if (initLoading)
  {
    return (
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>
            { mode === "create" ? "إضافة" : "تعديل" } نقل مواد
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Loading entityName="المادة" />
      </DialogContent>
    );
  }

  return (
    <ChangeDialog<ItemTransfer>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} عملية تحويل` }
      className="sm:max-w-5xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => storeState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ handleValidate }
    >
      <FieldGroup>
        <FieldsSection title="بيانات التحويل" columns={ 3 }>
          <TextField
            label="تاريخ الجرد"
            required
            value={ formData.transferDate ? new Date(formData.transferDate).toISOString().split("T")[0] : "" }
            isInvalid={ isInvalid("date") }
            error={ getError("date") }
            disabled
          />
          <FormField
            label="من مستودع"
            required
            isInvalid={ isInvalid("fromStoreId") }
            error={ getError("fromStoreId") }
          >
            <SearchableSelect
              items={ availableFromStores }
              itemLabelKey="name"
              itemValueKey="id"
              placeholder="اختر المستودع"
              value={ formData.fromStoreId?.toString() || "" }
              columnsNames={ StoreFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(StoreSlice.entityActions.filter(condition)) }
              errorInputClass={ errorInputClass("fromStoreId") }
              disabled={ storeState.isLoading || mode === "update" }
              onValueChange={ (val) =>
              {
                const selected = availableFromStores.find((s) => s.id.toString() === val);
                if (selected)
                {
                  ItemTransferActions.clear(dispatch);
                  handleChange({ fromStoreId: selected.id, fromStoreName: selected.name });
                }
              } }
            />
          </FormField>

          <FormField
            label="إلى مستودع"
            required
            isInvalid={ isInvalid("toStoreId") }
            error={ getError("toStoreId") }
          >
            <SearchableSelect
              items={ availableToStores }
              itemLabelKey="name"
              itemValueKey="id"
              placeholder="اختر المستودع"
              value={ formData.toStoreId?.toString() || "" }
              columnsNames={ StoreFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(StoreSlice.entityActions.filter(condition)) }
              errorInputClass={ errorInputClass("toStoreId") }
              disabled={ storeState.isLoading || mode === "update" }
              onValueChange={ (val) =>
              {
                const selected = availableToStores.find((s) => s.id.toString() === val);
                if (selected)
                {
                  handleChange({ toStoreId: selected.id, toStoreName: selected.name });
                }
              } }
            />
          </FormField>
        </FieldsSection>

        <FieldsSection columns={ 1 }>
          <TextField
            label="البيان والملاحظات"
            value={ formData.description || "" }
            onChange={ (e) => handleChange({ description: e.target.value }) }
          />
        </FieldsSection>

        <FieldsSection columns={ 1 }>
          { isInvalid("itemTransfersItems") && (
            <div className="text-sm text-red-500 mb-2 font-medium">
              { getError("itemTransfersItems") }
            </div>
          ) }

          { formData.fromStoreId && (
            <>
              { mode === "create" && (
                <StoreItemSelector
                  itemType={ ItemType.Product }
                  storeId={ formData.fromStoreId }
                  onSelect={ (storeItem, selectedIupm) =>
                  {
                    ItemTransferActions.addItem(dispatch, storeItem, selectedIupm);
                  } }
                />
              ) }

              <SelectedItemsTable mode={ mode } />
            </>
          ) }
        </FieldsSection>
      </FieldGroup>
    </ChangeDialog>
  );
}
