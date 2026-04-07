import { type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import {
  Button,
  ChangeDialog,
  Checkbox,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FieldGroup,
  FormField,
  Loading,
  NumberField,
  SearchableSelect,
  TextField,
  useEntityForm,
  useStorageFile,
} from "@yusr_systems/ui";
import { Box, Database, DollarSign, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Item, {
  ItemStore,
  ItemType,
  ItemUnitPricingMethod,
} from "../../core/data/item";
import {
  PricingMethodFilterColumns,
  PricingMethodSlice,
} from "../../core/data/pricingMethod";
import { StoreFilterColumns } from "../../core/data/store";
import { UnitFilterColumns, UnitSlice } from "../../core/data/unit";
import { fetchServiceIds } from "../../core/state/shared/serviceIdsSlice";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import { filterStores } from "../stores/logic/storeSlice";
import { filterTaxes } from "../taxes/logic/taxSlice";
import { ItemContext } from "./itemContext";
import BasicTab from "./basic/basicTab";

const TabButton = ({ active, icon: Icon, label, onClick }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
      active
        ? "border-primary text-primary bg-primary/10 font-extrabold text-base"
        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium text-sm"
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

export default function ChangeItemDialog({
  entity,
  mode,
  service,
  onSuccess,
}: CommonChangeDialogProps<Item>) {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"basic" | "pricing" | "storage">(
    "basic",
  );
  const [initLoading, setInitLoading] = useState(false);

  const unitState = useAppSelector((state) => state.unit);
  const pricingMethodState = useAppSelector((state) => state.pricingMethod);
  const storeState = useAppSelector((state) => state.store);

  const validationRules: ValidationRule<Partial<Item>>[] = useMemo(
    () => [
      {
        field: "name",
        selector: (d) => d.name,
        validators: [Validators.required("يرجى إدخال اسم المادة")],
      },
      {
        field: "type",
        selector: (d) => d.type,
        validators: [Validators.required("يرجى اختيار نوع المادة")],
      },
    ],
    [],
  );

  const initialValues = useMemo(
    () => ({
      type: entity?.type || ItemType.Product,
      statusId: entity?.statusId || 1,
      taxable: entity?.taxable ?? true,
      taxIncluded: entity?.taxIncluded ?? false,
      ...entity,
      name: entity?.name || "",
      itemUnitPricingMethods: entity?.itemUnitPricingMethods || [],
      itemTaxes: entity?.itemTaxes || [],
      itemStores: entity?.itemStores || [],
      itemImages: entity?.itemImages || [],
    }),
    [entity],
  );

  const { formData, handleChange, getError, isInvalid, validate, clearError } =
    useEntityForm<Item>(initialValues, validationRules);

  const {
    fileInputRef,
    handleFileChange,
    handleRemoveFile,
    handleDownload,
    showFilePreview,
    getFileSrc,
  } = useStorageFile(handleChange, "itemImages");

  useEffect(() => {
    dispatch(filterTaxes(undefined));
    dispatch(UnitSlice.entityActions.filter(undefined));
    dispatch(PricingMethodSlice.entityActions.filter(undefined));
    dispatch(filterStores(undefined));
    dispatch(fetchServiceIds());
  }, [dispatch]);

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

  // 2. التسعير
  const addPricingMethod = () =>
    handleChange({
      itemUnitPricingMethods: [
        ...(formData.itemUnitPricingMethods || []),
        new ItemUnitPricingMethod(),
      ],
    });
  const updatePricingMethod = (
    index: number,
    updates: Partial<ItemUnitPricingMethod>,
  ) => {
    const list = [...(formData.itemUnitPricingMethods || [])];
    let iupm = list[index];
    let suggestName = `${updates.unitName || iupm.unitName || ""} ${
      updates.pricingMethodName || iupm.pricingMethodName || ""
    }`;
    iupm.itemUnitPricingMethodName =
      updates.itemUnitPricingMethodName || suggestName;
    list[index] = { ...list[index], ...updates };
    handleChange({ itemUnitPricingMethods: list });
  };
  const removePricingMethod = (index: number) => {
    const list = [...(formData.itemUnitPricingMethods || [])];
    list.splice(index, 1);
    handleChange({ itemUnitPricingMethods: list });
  };

  // 3. التخزين
  const addStore = () =>
    handleChange({
      itemStores: [...(formData.itemStores || []), new ItemStore()],
    });
  const updateStore = (index: number, updates: Partial<ItemStore>) => {
    const list = [...(formData.itemStores || [])];
    list[index] = { ...list[index], ...updates }; // دمج التحديثات الجديدة

    if (updates.initialQuantity !== undefined) {
      const totalInitial = list.reduce(
        (sum, store) => sum + (Number(store.initialQuantity) || 0),
        0,
      );
      handleChange({ itemStores: list, initialQuantity: totalInitial });
    } else {
      handleChange({ itemStores: list });
    }
  };
  const removeStore = (index: number) => {
    const list = [...(formData.itemStores || [])];
    list.splice(index, 1);
    const totalInitial = list.reduce(
      (sum, store) => sum + (Number(store.initialQuantity) || 0),
      0,
    );
    handleChange({ itemStores: list, initialQuantity: totalInitial });
  };

  if (initLoading) {
    return (
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "إضافة" : "تعديل"} مادة
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Loading entityName="المادة" />
      </DialogContent>
    );
  }

  return (
    <ItemContext.Provider
      value={{
        mode,
        formData,
        handleChange,
        isInvalid,
        getError,
        clearError,
        fileInputRef,
        handleFileChange,
        handleRemoveFile,
        handleDownload,
        showFilePreview,
        getFileSrc,
      }}
    >
      <ChangeDialog<Item>
        title={`${mode === "create" ? "إضافة" : "تعديل"} مادة`}
        className="sm:max-w-7xl"
        formData={formData}
        dialogMode={mode}
        service={service}
        onSuccess={(data) => onSuccess?.(data, mode)}
        validate={validate}
      >
        <div className="flex flex-col h-[80vh]">
          <div className="flex justify-start border-b mb-4 shrink-0 bg-muted/20 rounded-t-lg">
            <TabButton
              active={activeTab === "basic"}
              icon={Box}
              label="المعلومات الأساسية"
              onClick={() => setActiveTab("basic")}
            />

            {formData.type !== ItemType.Service && (
              <TabButton
                active={activeTab === "storage"}
                icon={Database}
                label="التخزين"
                onClick={() => setActiveTab("storage")}
              />
            )}

            <TabButton
              active={activeTab === "pricing"}
              icon={DollarSign}
              label="التسعير"
              onClick={() => setActiveTab("pricing")}
            />
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-2">
            <FieldGroup>
              {activeTab === "basic" && <BasicTab />}

              {activeTab === "storage" && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-3 gap-6">
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
                      onChange={(e) =>
                        handleChange({ location: e.target.value })
                      }
                    />
                    <NumberField
                      label="الكمية الافتتاحية الإجمالية"
                      value={formData.initialQuantity || 0}
                      disabled={true}
                      className="bg-muted font-bold"
                    />
                    <NumberField
                      label="الكمية الحالية"
                      value={formData.quantity || 0}
                      disabled={true}
                      className="bg-muted font-bold"
                    />
                  </div>

                  <div className="pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">طرق التخزين</h3>
                      <Button type="button" size="sm" onClick={addStore}>
                        <Plus className="w-4 h-4 ml-2" /> إضافة طريقة تخزين
                      </Button>
                    </div>

                    <div className="bg-muted/20 rounded-lg border overflow-hidden">
                      <table className="w-full text-sm text-right">
                        <thead className="bg-muted/50 text-muted-foreground">
                          <tr>
                            <th className="p-3 w-16">الرقم</th>
                            <th className="p-3 w-48">المستودع</th>
                            <th className="p-3 w-48">الكمية الافتتاحية</th>
                            <th className="p-3 w-48">الكمية الحالية</th>
                            <th className="p-3 w-16 text-center"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.itemStores?.map((store, index) => (
                            <tr key={index} className="border-t border-muted">
                              <td className="p-3 font-bold">{index + 1}</td>
                              <td className="p-3">
                                <FormField
                                  label=""
                                  isInvalid={isInvalid("storeId")}
                                  error={getError("storeId")}
                                >
                                  <SearchableSelect
                                    items={storeState.entities.data ?? []}
                                    itemLabelKey="storeName"
                                    itemValueKey="id"
                                    value={store.storeId?.toString() || ""}
                                    onValueChange={(val) => {
                                      const selected =
                                        storeState.entities.data?.find(
                                          (s) => s.id.toString() === val,
                                        );
                                      updateStore(index, {
                                        storeId: selected?.id,
                                        storeName: selected?.storeName,
                                      });
                                    }}
                                    columnsNames={
                                      StoreFilterColumns.columnsNames
                                    }
                                    onSearch={(condition) =>
                                      dispatch(filterStores(condition))
                                    }
                                    disabled={storeState.isLoading}
                                  />
                                </FormField>
                              </td>
                              <td className="p-3">
                                <NumberField
                                  label=""
                                  value={store.initialQuantity || 0}
                                  onChange={(val) =>
                                    updateStore(index, {
                                      initialQuantity: val,
                                    })
                                  }
                                />
                              </td>
                              <td className="p-3">
                                <NumberField
                                  label=""
                                  value={store.quantity || 0}
                                  disabled
                                />
                              </td>
                              <td className="p-3 text-center">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                  onClick={() => removeStore(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {formData.itemStores?.length === 0 && (
                        <div className="p-4 text-center text-muted-foreground">
                          لا توجد مستودعات مضافة
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "pricing" && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-3 gap-6">
                    <FormField
                      label="الوحدة الأساسية للمادة"
                      required
                      isInvalid={isInvalid("storeId")}
                      error={getError("storeId")}
                    >
                      <SearchableSelect
                        items={unitState.entities.data ?? []}
                        itemLabelKey="unitName"
                        itemValueKey="id"
                        value={formData.sellUnitId?.toString() || ""}
                        onValueChange={(val) => {
                          const selected = unitState.entities.data?.find(
                            (u) => u.id.toString() === val,
                          );
                          handleChange({
                            sellUnitId: selected?.id,
                            sellUnitName: selected?.unitName,
                          });
                        }}
                        columnsNames={UnitFilterColumns.columnsNames}
                        onSearch={(condition) =>
                          dispatch(UnitSlice.entityActions.filter(condition))
                        }
                        disabled={
                          unitState.isLoading ||
                          formData.type === ItemType.Service
                        }
                      />
                    </FormField>

                    <NumberField
                      label="التكلفة المبدئية"
                      required
                      value={formData.initialCost || 0}
                      onChange={(val) => handleChange({ initialCost: val })}
                    />
                    <NumberField
                      label="التكلفة"
                      disabled
                      value={formData.cost || 0}
                      onChange={(val) => handleChange({ cost: val })}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.taxIncluded}
                      onCheckedChange={(checked) =>
                        handleChange({ taxIncluded: checked as boolean })
                      }
                    />
                    <label htmlFor="taxIncluded" className="text-sm font-bold">
                      سعر البيع يشمل الضريبة
                    </label>
                  </div>

                  <div className="pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">طرق التسعير</h3>
                      <Button
                        type="button"
                        size="sm"
                        onClick={addPricingMethod}
                      >
                        <Plus className="w-4 h-4 ml-2" /> إضافة طريقة تسعير
                      </Button>
                    </div>

                    <div className="bg-muted/20 rounded-lg border overflow-hidden overflow-x-auto">
                      <table className="w-full text-sm text-right min-w-200">
                        <thead className="bg-muted/50 text-muted-foreground">
                          <tr>
                            <th className="p-3 w-12">الرقم</th>
                            <th className="p-3 w-32">الوحدة</th>
                            <th className="p-3 w-40">طريقة التسعير</th>
                            <th className="p-3 w-32">الكمية في الوحدة</th>
                            <th className="p-3 w-32">سعر البيع</th>
                            <th className="p-3 w-40">الباركود</th>
                            <th className="p-3 w-40">الاسم</th>
                            <th className="p-3 w-12 text-center"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.itemUnitPricingMethods?.map(
                            (method, index) => (
                              <tr key={index} className="border-t border-muted">
                                <td className="p-3 font-bold">{index + 1}</td>
                                <td className="p-3">
                                  <FormField label="">
                                    <SearchableSelect
                                      items={unitState.entities.data ?? []}
                                      itemLabelKey="unitName"
                                      itemValueKey="id"
                                      value={method.unitId?.toString() || ""}
                                      onValueChange={(val) => {
                                        const selected =
                                          unitState.entities.data?.find(
                                            (u) => u.id.toString() === val,
                                          );
                                        updatePricingMethod(index, {
                                          unitId: selected?.id,
                                          unitName: selected?.unitName,
                                        });
                                      }}
                                      columnsNames={
                                        UnitFilterColumns.columnsNames
                                      }
                                      onSearch={(condition) =>
                                        dispatch(
                                          UnitSlice.entityActions.filter(
                                            condition,
                                          ),
                                        )
                                      }
                                      disabled={
                                        unitState.isLoading ||
                                        formData.type === ItemType.Service
                                      }
                                    />
                                  </FormField>
                                </td>
                                <td className="p-3">
                                  <FormField label="">
                                    <SearchableSelect
                                      items={
                                        pricingMethodState.entities.data ?? []
                                      }
                                      itemLabelKey="pricingMethodName"
                                      itemValueKey="id"
                                      value={
                                        method.pricingMethodId?.toString() || ""
                                      }
                                      onValueChange={(val) => {
                                        const selected =
                                          pricingMethodState.entities.data?.find(
                                            (p) => p.id.toString() === val,
                                          );
                                        updatePricingMethod(index, {
                                          pricingMethodId: selected?.id,
                                          pricingMethodName:
                                            selected?.pricingMethodName,
                                        });
                                      }}
                                      columnsNames={
                                        PricingMethodFilterColumns.columnsNames
                                      }
                                      onSearch={(condition) =>
                                        dispatch(
                                          PricingMethodSlice.entityActions.filter(
                                            condition,
                                          ),
                                        )
                                      }
                                      disabled={
                                        pricingMethodState.isLoading ||
                                        formData.type === ItemType.Service
                                      }
                                    />
                                  </FormField>
                                </td>
                                <td className="p-3">
                                  <NumberField
                                    label=""
                                    min={1}
                                    disabled={
                                      method.unitId === formData.sellUnitId
                                    }
                                    value={method.quantityMultiplier || 1}
                                    onChange={(val) =>
                                      updatePricingMethod(index, {
                                        quantityMultiplier: val,
                                      })
                                    }
                                  />
                                </td>
                                <td className="p-3">
                                  <NumberField
                                    label=""
                                    min={0}
                                    value={method.price || 0}
                                    onChange={(val) =>
                                      updatePricingMethod(index, { price: val })
                                    }
                                  />
                                </td>
                                <td className="p-3">
                                  <TextField
                                    label=""
                                    value={method.barcode || ""}
                                    onChange={(e) =>
                                      updatePricingMethod(index, {
                                        barcode: e.target.value,
                                      })
                                    }
                                    dir="ltr"
                                  />
                                </td>
                                <td className="p-3">
                                  <TextField
                                    label=""
                                    value={
                                      method.itemUnitPricingMethodName || ""
                                    }
                                    onChange={(e) =>
                                      updatePricingMethod(index, {
                                        itemUnitPricingMethodName:
                                          e.target.value,
                                      })
                                    }
                                  />
                                </td>
                                <td className="p-3 text-center">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                    onClick={() => removePricingMethod(index)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                      {formData.itemUnitPricingMethods?.length === 0 && (
                        <div className="p-4 text-center text-muted-foreground">
                          لا توجد طرق تسعير مضافة
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </FieldGroup>
          </div>
        </div>
      </ChangeDialog>
    </ItemContext.Provider>
  );
}
