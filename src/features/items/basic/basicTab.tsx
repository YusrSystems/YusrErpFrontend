import { type DialogMode, SelectField, StorageFileField, TextAreaField, TextField, useFormErrors, useStorageFile } from "@yusr_systems/ui";
import { useEffect } from "react";
import Item, { ItemSlice, ItemType, ItemUnitPricingMethod } from "../../../core/data/item";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";
import TaxesSection from "./taxesSection";

export default function BasicTab({ mode }: { mode: DialogMode; })
{
  const dispatch = useAppDispatch();
  const {
    fileInputRef,
    handleFileChange,
    handleRemoveFile,
    handleDownload,
    showFilePreview,
    getFileSrc
  } = useStorageFile((data) => dispatch(ItemSlice.formActions.updateFormData(data as Partial<Item>)), "itemImages");

  const { formData, errors } = useAppSelector((state) => state.itemForm);
  const { getError, isInvalid } = useFormErrors(errors);

  const serviceIdsState = useAppSelector((state) => state.serviceIds);

  useEffect(() =>
  {
    console.log(formData);
  }, [formData]);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="اسم المادة"
              required
              value={ formData.name || "" }
              isInvalid={ isInvalid("name") }
              error={ getError("name") }
              onChange={ (e) =>
              {
                dispatch(ItemSlice.formActions.updateFormData({ name: e.target.value }));
                dispatch(ItemSlice.formActions.clearError("name"));
              } }
            />
            <SelectField
              label="نوع المادة"
              required
              disabled={ mode === "update" }
              value={ formData.type?.toString() || "" }
              onValueChange={ (val) =>
                dispatch(ItemSlice.formActions.updateFormData({
                  type: Number(val) as ItemType,
                  itemStores: [],
                  initialQuantity: 0,
                  sellUnitId: val === ItemType.Service.toString()
                    ? serviceIdsState.serviceIds?.unitId || 0
                    : undefined,
                  sellUnitName: val === ItemType.Service.toString() ? "خدمة" : undefined,
                  itemUnitPricingMethods: val === ItemType.Service.toString()
                    ? [
                      new ItemUnitPricingMethod({
                        unitId: serviceIdsState.serviceIds?.unitId || 0,
                        pricingMethodId: serviceIdsState.serviceIds?.pricingMethodId || 0,
                        unitName: "خدمة",
                        pricingMethodName: "خدمة",
                        quantityMultiplier: 1,
                        itemUnitPricingMethodName: "خدمة"
                      })
                    ]
                    : []
                })) }
              options={ [{ label: "منتج", value: ItemType.Product.toString() }, {
                label: "خدمة",
                value: ItemType.Service.toString()
              }] }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="الصنف"
              value={ formData.class || "" }
              onChange={ (e) => dispatch(ItemSlice.formActions.updateFormData({ class: e.target.value })) }
            />
            <SelectField
              label="الحالة"
              required
              value={ formData.statusId?.toString() || "1" }
              onValueChange={ (val) => dispatch(ItemSlice.formActions.updateFormData({ statusId: Number(val) })) }
              options={ [{ label: "مفعل", value: "1" }, { label: "غير مفعل", value: "0" }] }
            />
          </div>

          <TextAreaField
            label="وصف المادة"
            value={ formData.description || "" }
            onChange={ (e) => dispatch(ItemSlice.formActions.updateFormData({ description: e.target.value })) }
            rows={ 2 }
          />

          <TextAreaField
            label="ملاحظات"
            value={ formData.notes || "" }
            onChange={ (e) => dispatch(ItemSlice.formActions.updateFormData({ notes: e.target.value })) }
            rows={ 2 }
          />
        </div>

        <div className="w-full lg:w-108 shrink-0 bg-muted/10 p-4 rounded-lg border">
          <StorageFileField
            label="صور المادة"
            file={ formData.itemImages }
            fileInputRef={ fileInputRef }
            onFileChange={ handleFileChange }
            onRemove={ handleRemoveFile }
            onDownload={ handleDownload }
            getFileSrc={ getFileSrc }
            showPreview={ showFilePreview }
          />
        </div>
      </div>

      <TaxesSection mode={ mode } />
    </div>
  );
}
