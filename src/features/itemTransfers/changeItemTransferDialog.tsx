import { type ValidationRule, Validators } from "@yusr_systems/core";
import { ChangeDialog, type CommonChangeDialogProps, DateField, FieldGroup, FieldsSection, FormField, SearchableSelect, TextField, useEntityForm } from "@yusr_systems/ui";
import { useEffect, useMemo } from "react";
import ItemTransfer from "../../core/data/itemTransfer";
import { StoreFilterColumns } from "../../core/data/store";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import { filterStores } from "../stores/logic/storeSlice";
import TransferItemAdder from "./transferItemAdder";

export default function ChangeItemTransferDialog({
  entity,
  mode,
  service,
  onSuccess
}: CommonChangeDialogProps<ItemTransfer>)
{
  const dispatch = useAppDispatch();
  const storeState = useAppSelector((state) => state.store);

  const validationRules: ValidationRule<Partial<ItemTransfer>>[] = useMemo(
    () => [{
      field: "transferDate",
      selector: (d) => d.transferDate,
      validators: [Validators.required("يرجى إدخال تاريخ التحويل")]
    }, {
      field: "fromStoreId",
      selector: (d) => d.fromStoreId,
      validators: [Validators.required("يرجى اختيار المستودع المحول منه")]
    }, {
      field: "toStoreId",
      selector: (d) => d.toStoreId,
      validators: [
        Validators.required("يرجى اختيار المستودع المحول إليه"),
        Validators.custom(
          (val, formData) => val !== formData.fromStoreId,
          "لا يمكن التحويل لنفس المستودع"
        )
      ]
    }, {
      field: "itemTransfersItems",
      selector: (d) => d.itemTransfersItems,
      validators: [Validators.arrayMinLength(1, "يرجى إضافة مادة واحدة على الأقل للتحويل")]
    }],
    []
  );

  const initialValues = useMemo(
    () => ({
      ...entity,
      transferDate: entity?.transferDate || new Date().toISOString(),
      itemTransfersItems: entity?.itemTransfersItems || []
    }),
    [entity]
  );

  const { formData, handleChange, getError, isInvalid, validate, errorInputClass } = useEntityForm<ItemTransfer>(
    initialValues,
    validationRules
  );

  useEffect(() =>
  {
    dispatch(filterStores(undefined));
  }, [dispatch]);

  // فلترة المستودعات المتاحة لحقل "من مستودع" (إخفاء المستودع المختار في "إلى")
  const availableFromStores = useMemo(() =>
  {
    if (!storeState.entities.data)
    {
      return [];
    }
    return storeState.entities.data.filter((s) => s.id !== formData.toStoreId);
  }, [storeState.entities.data, formData.toStoreId]);

  // فلترة المستودعات المتاحة لحقل "إلى مستودع" (إخفاء المستودع المختار في "من")
  const availableToStores = useMemo(() =>
  {
    if (!storeState.entities.data)
    {
      return [];
    }
    return storeState.entities.data.filter((s) => s.id !== formData.fromStoreId);
  }, [storeState.entities.data, formData.fromStoreId]);

  return (
    <ChangeDialog<ItemTransfer>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} عملية تحويل` }
      className="sm:max-w-5xl"
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => storeState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <FieldGroup>
        <FieldsSection title="بيانات التحويل" columns={ 3 }>
          <DateField
            label="تاريخ التحويل"
            required
            value={ formData.transferDate ? new Date(formData.transferDate) : undefined }
            onChange={ (date) => handleChange({ transferDate: date?.toISOString() }) }
            isInvalid={ isInvalid("transferDate") }
            error={ getError("transferDate") }
          />

          <FormField
            label="من مستودع"
            required
            isInvalid={ isInvalid("fromStoreId") }
            error={ getError("fromStoreId") }
          >
            <SearchableSelect
              items={ availableFromStores } // استخدام القائمة المفلترة
              itemLabelKey="storeName"
              itemValueKey="id"
              placeholder="اختر المستودع"
              value={ formData.fromStoreId?.toString() || "" }
              columnsNames={ StoreFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(filterStores(condition)) }
              errorInputClass={ errorInputClass("fromStoreId") }
              disabled={ storeState.isLoading }
              onValueChange={ (val) =>
              {
                const selected = availableFromStores.find((s) => s.id.toString() === val);
                if (selected)
                {
                  handleChange({ fromStoreId: selected.id, fromStoreName: selected.storeName });
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
              items={ availableToStores } // استخدام القائمة المفلترة
              itemLabelKey="storeName"
              itemValueKey="id"
              placeholder="اختر المستودع"
              value={ formData.toStoreId?.toString() || "" }
              columnsNames={ StoreFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(filterStores(condition)) }
              errorInputClass={ errorInputClass("toStoreId") }
              disabled={ storeState.isLoading }
              onValueChange={ (val) =>
              {
                const selected = availableToStores.find((s) => s.id.toString() === val);
                if (selected)
                {
                  handleChange({ toStoreId: selected.id, toStoreName: selected.storeName });
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

        <FieldsSection title="المواد المحولة" columns={ 1 }>
          { isInvalid("itemTransfersItems") && (
            <div className="text-sm text-red-500 mb-2 font-medium">
              { getError("itemTransfersItems") }
            </div>
          ) }
          <TransferItemAdder
            fromStoreId={ formData.fromStoreId }
            value={ formData.itemTransfersItems }
            onChange={ (items) => handleChange({ itemTransfersItems: items }) }
          />
        </FieldsSection>
      </FieldGroup>
    </ChangeDialog>
  );
}
