import { SelectField, StorageFileField, TextAreaField, TextField } from "@yusr_systems/ui";
import { ItemType, ItemUnitPricingMethod } from "../../../core/data/item";
import { useAppSelector } from "../../../core/state/store";
import { useItemContext } from "../itemContext";
import TaxesSection from "./taxesSection";

export default function BasicTab()
{
  const {
    mode,
    formData,
    handleChange,
    isInvalid,
    getError,
    clearError,
    fileInputRef,
    getFileSrc,
    handleDownload,
    handleFileChange,
    handleRemoveFile,
    showFilePreview
  } = useItemContext();

  const serviceIdsState = useAppSelector((state) => state.serviceIds);

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
                handleChange({ name: e.target.value });
                clearError("name");
              } }
            />
            <SelectField
              label="نوع المادة"
              required
              disabled={ mode === "update" }
              value={ formData.type?.toString() || "" }
              onValueChange={ (val) =>
                handleChange({
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
                }) }
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
              onChange={ (e) => handleChange({ class: e.target.value }) }
            />
            <SelectField
              label="الحالة"
              required
              value={ formData.statusId?.toString() || "1" }
              onValueChange={ (val) => handleChange({ statusId: Number(val) }) }
              options={ [{ label: "مفعل", value: "1" }, { label: "غير مفعل", value: "0" }] }
            />
          </div>

          <TextAreaField
            label="وصف المادة"
            value={ formData.description || "" }
            onChange={ (e) => handleChange({ description: e.target.value }) }
            rows={ 2 }
          />

          <TextAreaField
            label="ملاحظات"
            value={ formData.notes || "" }
            onChange={ (e) => handleChange({ notes: e.target.value }) }
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

      <TaxesSection />
    </div>
  );
}
