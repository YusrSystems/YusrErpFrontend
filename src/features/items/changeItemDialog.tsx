import { type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import {
  Button,
  ChangeDialog,
  FieldGroup,
  FieldsSection,
  NumberField,
  SearchableSelect,
  SelectField,
  StorageFileField,
  TextAreaField,
  TextField,
  useEntityForm,
  useStorageFile
} from "@yusr_systems/ui";
import { Plus, Trash2, Box, DollarSign, Database } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import Item, { ItemType, ItemTax, ItemUnitPricingMethod, ItemStore } from "../../core/data/item";
import { filterStores } from "../stores/logic/storeSlice";
import { filterTaxes } from "../taxes/logic/taxSlice";
import { UnitSlice } from "../../core/data/unit";

// --- بافتراض وجود هذه السلايسز في نظامك لجلب القوائم المنسدلة ---
// import { filterTaxes } from "../../settings/logic/taxSlice";
// import { filterUnits } from "../../settings/logic/unitSlice";
// import { filterPricingMethods } from "../../settings/logic/pricingMethodSlice";
// import { filterStores } from "../../inventory/logic/storeSlice";

// مكون التبويبات المخصص ليطابق التصميم
const TabButton = ({ active, icon: Icon, label, onClick }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
      active 
        ? "border-blue-500 text-blue-500 bg-blue-500/10" 
        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

export default function ChangeItemDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<Item>) {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"basic" | "pricing" | "storage">("basic");
  
  const validationRules: ValidationRule<Partial<Item>>[] = useMemo(
    () => [
      { field: "name", selector: (d) => d.name, validators: [Validators.required("يرجى إدخال اسم المادة")] },
      { field: "type", selector: (d) => d.type, validators: [Validators.required("يرجى اختيار نوع المادة")] },
    ],
    []
  );

  const initialValues = useMemo(() => ({
    type: entity?.type || ItemType.Product,
    statusId: entity?.statusId || 1, // 1 مفعل كافتراضي
    taxable: entity?.taxable ?? true,
    taxIncluded: entity?.taxIncluded ?? false,
    ...entity,
    name: entity?.name || "",
    itemUnitPricingMethods: entity?.itemUnitPricingMethods || [],
    itemTaxes: entity?.itemTaxes || [],
    itemStores: entity?.itemStores || [],
    itemImages: entity?.itemImages || []
  }), [entity]);

  const { formData, handleChange, getError, isInvalid, validate, clearError } = useEntityForm<Item>(
    initialValues,
    validationRules
  );

  const { fileInputRef, handleFileChange, handleRemoveFile, handleDownload, showFilePreview, getFileSrc } = useStorageFile(handleChange, "itemImages");

  useEffect(() => {
    dispatch(filterTaxes(undefined));
    dispatch(UnitSlice.entityActions.filter(undefined));
    // dispatch(PricingMethodSlice.entityActions.filter(undefined));
    dispatch(filterStores(undefined));
  }, [dispatch]);

  // --- دوال إدارة الجداول الديناميكية ---
  
  // 1. الضرائب
  const addTax = () => handleChange({ itemTaxes: [...(formData.itemTaxes || []), new ItemTax()] });
  const updateTax = (index: number, field: keyof ItemTax, value: any) => {
    const list = [...(formData.itemTaxes || [])];
    list[index] = { ...list[index], [field]: value };
    handleChange({ itemTaxes: list });
  };
  const removeTax = (index: number) => {
    const list = [...(formData.itemTaxes || [])];
    list.splice(index, 1);
    handleChange({ itemTaxes: list });
  };

  // 2. التسعير
  const addPricingMethod = () => handleChange({ itemUnitPricingMethods: [...(formData.itemUnitPricingMethods || []), new ItemUnitPricingMethod()] });
  const updatePricingMethod = (index: number, field: keyof ItemUnitPricingMethod, value: any) => {
    const list = [...(formData.itemUnitPricingMethods || [])];
    list[index] = { ...list[index], [field]: value };
    handleChange({ itemUnitPricingMethods: list });
  };
  const removePricingMethod = (index: number) => {
    const list = [...(formData.itemUnitPricingMethods || [])];
    list.splice(index, 1);
    handleChange({ itemUnitPricingMethods: list });
  };

  // 3. التخزين
  const addStore = () => handleChange({ itemStores: [...(formData.itemStores || []), new ItemStore()] });
  const updateStore = (index: number, field: keyof ItemStore, value: any) => {
    const list = [...(formData.itemStores || [])];
    list[index] = { ...list[index], [field]: value };
    
    // حساب إجمالي الكمية الافتتاحية تلقائياً
    if (field === "initialQuantity") {
      const totalInitial = list.reduce((sum, store) => sum + (Number(store.initialQuantity) || 0), 0);
      handleChange({ itemStores: list, initialQuantity: totalInitial });
    } else {
      handleChange({ itemStores: list });
    }
  };
  const removeStore = (index: number) => {
    const list = [...(formData.itemStores || [])];
    list.splice(index, 1);
    const totalInitial = list.reduce((sum, store) => sum + (Number(store.initialQuantity) || 0), 0);
    handleChange({ itemStores: list, initialQuantity: totalInitial });
  };

  return (
    <ChangeDialog<Item>
      title={`${mode === "create" ? "إضافة" : "تعديل"} مادة`}
      className="sm:max-w-7xl" // نافذة عريضة جداً لتطابق التصميم
      formData={formData}
      dialogMode={mode}
      service={service}
      onSuccess={(data) => onSuccess?.(data, mode)}
      validate={validate}
    >
      <div className="flex flex-col h-[80vh]">
        
        {/* شريط التبويبات (محاذاة لليمين كما في الصورة) */}
        <div className="flex justify-end border-b mb-4 shrink-0 bg-muted/20 rounded-t-lg">
          <TabButton active={activeTab === "storage"} icon={Database} label="التخزين" onClick={() => setActiveTab("storage")} />
          <TabButton active={activeTab === "pricing"} icon={DollarSign} label="التسعير" onClick={() => setActiveTab("pricing")} />
          <TabButton active={activeTab === "basic"} icon={Box} label="المعلومات الأساسية" onClick={() => setActiveTab("basic")} />
        </div>

        {/* محتوى التبويبات */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          <FieldGroup>
            
            {/* ================= التبويب الأول: المعلومات الأساسية ================= */}
            {activeTab === "basic" && (
              <div className="space-y-6 animate-in fade-in">
                
                {/* القسم العلوي: الحقول يمين والصور يسار */}
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* الحقول النصية */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <TextField
                        label="اسم المادة"
                        required
                        value={formData.name || ""}
                        isInvalid={isInvalid("name")}
                        error={getError("name")}
                        onChange={(e) => { handleChange({ name: e.target.value }); clearError("name"); }}
                      />
                      <SelectField
                        label="نوع المادة"
                        required
                        value={formData.type?.toString() || ""}
                        onValueChange={(val) => handleChange({ type: Number(val) as ItemType })}
                        options={[
                          { label: "منتج", value: ItemType.Product.toString() },
                          { label: "خدمة", value: ItemType.Service.toString() }
                        ]}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <SelectField
                        label="الحالة"
                        required
                        value={formData.statusId?.toString() || "1"}
                        onValueChange={(val) => handleChange({ statusId: Number(val) })}
                        options={[
                          { label: "مفعل", value: "1" },
                          { label: "غير مفعل", value: "0" }
                        ]}
                      />
                      <TextField
                        label="الصنف (Class)"
                        value={formData.class || ""}
                        onChange={(e) => handleChange({ class: e.target.value })}
                      />
                    </div>

                    <TextAreaField
                      label="وصف المادة"
                      value={formData.description || ""}
                      onChange={(e) => handleChange({ description: e.target.value })}
                      rows={2}
                    />
                    
                    <TextAreaField
                      label="ملاحظات"
                      value={formData.notes || ""}
                      onChange={(e) => handleChange({ notes: e.target.value })}
                      rows={2}
                    />
                  </div>

                  {/* منطقة رفع الصور */}
                  <div className="w-full lg:w-80 shrink-0 bg-muted/10 p-4 rounded-lg border">
                    <StorageFileField
                      label="صور المادة"
                      file={formData.itemImages}
                      fileInputRef={fileInputRef}
                      onFileChange={handleFileChange}
                      onRemove={handleRemoveFile}
                      onDownload={handleDownload}
                      getFileSrc={getFileSrc}
                      showPreview={showFilePreview}
                    />
                  </div>
                </div>

                {/* قسم الضرائب */}
                <div className="pt-6 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <input 
                      type="checkbox" 
                      id="taxable" 
                      checked={formData.taxable} 
                      onChange={(e) => handleChange({ taxable: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="taxable" className="text-sm font-bold">خاضعة للضريبة</label>
                  </div>

                  {formData.taxable && (
                    <div className="space-y-3">
                      <Button type="button" size="sm" onClick={addTax} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 ml-2" /> إضافة ضريبة
                      </Button>
                      
                      <div className="bg-muted/20 rounded-lg border overflow-hidden">
                        <table className="w-full text-sm text-right">
                          <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                              <th className="p-3 w-16">الرقم</th>
                              <th className="p-3">الضريبة</th>
                              <th className="p-3 w-32">نسبة الضريبة</th>
                              <th className="p-3 w-16 text-center">إجراء</th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.itemTaxes?.map((tax, index) => (
                              <tr key={index} className="border-t border-muted">
                                <td className="p-3 font-bold">{index + 1}</td>
                                <td className="p-3">
                                  <TextField 
                                    label="" 
                                    placeholder="اسم الضريبة"
                                    value={tax.taxName || ""} 
                                    onChange={(e) => updateTax(index, "taxName", e.target.value)} 
                                  />
                                </td>
                                <td className="p-3">
                                  <NumberField 
                                    label="" 
                                    value={tax.taxPercentage || 0} 
                                    onChange={(val) => updateTax(index, "taxPercentage", val)} 
                                  />
                                </td>
                                <td className="p-3 text-center">
                                  <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-100" onClick={() => removeTax(index)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {formData.itemTaxes?.length === 0 && <div className="p-4 text-center text-muted-foreground">لا توجد ضرائب مضافة</div>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= التبويب الثاني: التسعير ================= */}
            {activeTab === "pricing" && (
              <div className="space-y-6 animate-in fade-in">
                
                <div className="grid grid-cols-3 gap-6">
                  <TextField
                    label="الوحدة الأساسية للمادة"
                    required
                    value={formData.sellUnitName || ""}
                    onChange={(e) => handleChange({ sellUnitName: e.target.value })}
                  />
                  <NumberField
                    label="التكلفة المبدئية"
                    required
                    value={formData.initialCost || 0}
                    onChange={(val) => handleChange({ initialCost: val })}
                  />
                  <NumberField
                    label="التكلفة"
                    required
                    value={formData.cost || 0}
                    onChange={(val) => handleChange({ cost: val })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="taxIncluded" 
                    checked={formData.taxIncluded} 
                    onChange={(e) => handleChange({ taxIncluded: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="taxIncluded" className="text-sm font-bold">سعر البيع يشمل الضريبة</label>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">طرق التسعير</h3>
                    <Button type="button" size="sm" onClick={addPricingMethod} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 ml-2" /> إضافة طريقة تسعير
                    </Button>
                  </div>

                  <div className="bg-muted/20 rounded-lg border overflow-hidden overflow-x-auto">
                    <table className="w-full text-sm text-right min-w-[800px]">
                      <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                          <th className="p-3 w-12">الرقم</th>
                          <th className="p-3 w-32">الوحدة</th>
                          <th className="p-3 w-40">طريقة التسعير</th>
                          <th className="p-3 w-32">الكمية في الوحدة</th>
                          <th className="p-3 w-32">سعر البيع</th>
                          <th className="p-3 w-40">الباركود</th>
                          <th className="p-3 w-40">الاسم</th>
                          <th className="p-3 w-12 text-center">إجراء</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.itemUnitPricingMethods?.map((method, index) => (
                          <tr key={index} className="border-t border-muted">
                            <td className="p-3 font-bold">{index + 1}</td>
                            <td className="p-3">
                              <TextField label="" placeholder="الوحدة" value={method.unitName || ""} onChange={(e) => updatePricingMethod(index, "unitName", e.target.value)} />
                            </td>
                            <td className="p-3">
                              <TextField label="" placeholder="طريقة التسعير" value={method.pricingMethodName || ""} onChange={(e) => updatePricingMethod(index, "pricingMethodName", e.target.value)} />
                            </td>
                            <td className="p-3">
                              <NumberField label="" value={method.quantityMultiplier || 0} onChange={(val) => updatePricingMethod(index, "quantityMultiplier", val)} />
                            </td>
                            <td className="p-3">
                              <NumberField label="" value={method.price || 0} onChange={(val) => updatePricingMethod(index, "price", val)} />
                            </td>
                            <td className="p-3">
                              <TextField label="" value={method.barcode || ""} onChange={(e) => updatePricingMethod(index, "barcode", e.target.value)} dir="ltr" />
                            </td>
                            <td className="p-3">
                              <TextField label="" value={method.itemUnitPricingMethodName || ""} onChange={(e) => updatePricingMethod(index, "itemUnitPricingMethodName", e.target.value)} />
                            </td>
                            <td className="p-3 text-center">
                              <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-100" onClick={() => removePricingMethod(index)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {formData.itemUnitPricingMethods?.length === 0 && <div className="p-4 text-center text-muted-foreground">لا توجد طرق تسعير مضافة</div>}
                  </div>
                </div>
              </div>
            )}

            {/* ================= التبويب الثالث: التخزين ================= */}
            {activeTab === "storage" && (
              <div className="space-y-6 animate-in fade-in">
                
                <div className="grid grid-cols-4 gap-6">
                  <NumberField
                    label="الحد الأدنى للكمية"
                    value={formData.minQuantity || 0}
                    onChange={(val) => handleChange({ minQuantity: val })}
                  />
                  <NumberField
                    label="الحد الأعلى للكمية"
                    value={formData.maxQuantity || 0}
                    onChange={(val) => handleChange({ maxQuantity: val })}
                  />
                  <TextField
                    label="موقع المادة في المخزن"
                    value={formData.location || ""}
                    onChange={(e) => handleChange({ location: e.target.value })}
                  />
                  <NumberField
                    label="الكمية الافتتاحية الإجمالية"
                    value={formData.initialQuantity || 0}
                    disabled={true} // تُحسب تلقائياً من الجدول
                    className="bg-muted font-bold"
                  />
                </div>

                <div className="pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">طرق التخزين</h3>
                    <Button type="button" size="sm" onClick={addStore} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 ml-2" /> إضافة طريقة تخزين
                    </Button>
                  </div>

                  <div className="bg-muted/20 rounded-lg border overflow-hidden">
                    <table className="w-full text-sm text-right">
                      <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                          <th className="p-3 w-16">الرقم</th>
                          <th className="p-3">المستودع</th>
                          <th className="p-3 w-48">الكمية الافتتاحية</th>
                          <th className="p-3 w-16 text-center">إجراء</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.itemStores?.map((store, index) => (
                          <tr key={index} className="border-t border-muted">
                            <td className="p-3 font-bold">{index + 1}</td>
                            <td className="p-3">
                              <TextField label="" placeholder="اسم المستودع" value={store.storeName || ""} onChange={(e) => updateStore(index, "storeName", e.target.value)} />
                            </td>
                            <td className="p-3">
                              <NumberField label="" value={store.initialQuantity || 0} onChange={(val) => updateStore(index, "initialQuantity", val)} />
                            </td>
                            <td className="p-3 text-center">
                              <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-100" onClick={() => removeStore(index)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {formData.itemStores?.length === 0 && <div className="p-4 text-center text-muted-foreground">لا توجد مستودعات مضافة</div>}
                  </div>
                </div>
              </div>
            )}

          </FieldGroup>
        </div>
      </div>
    </ChangeDialog>
  );
}