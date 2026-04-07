import { type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import {
  ChangeDialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FieldGroup,
  Loading,
  useEntityForm,
  useStorageFile,
} from "@yusr_systems/ui";
import { Box, Database, DollarSign } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Item, { ItemType } from "../../core/data/item";
import { PricingMethodSlice } from "../../core/data/pricingMethod";
import { UnitSlice } from "../../core/data/unit";
import { fetchServiceIds } from "../../core/state/shared/serviceIdsSlice";
import { useAppDispatch } from "../../core/state/store";
import { filterStores } from "../stores/logic/storeSlice";
import { filterTaxes } from "../taxes/logic/taxSlice";
import { ItemContext } from "./itemContext";
import BasicTab from "./basic/basicTab";
import StorageTab from "./storage/storageTab";
import PricingTab from "./pricing/pricingTab";

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
              {activeTab === "storage" && <StorageTab />}
              {activeTab === "pricing" && <PricingTab />}
            </FieldGroup>
          </div>
        </div>
      </ChangeDialog>
    </ItemContext.Provider>
  );
}
