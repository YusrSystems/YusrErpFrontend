import { type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import ChangeDialogTabbed from "../../core/components/changeDialogTabbed";

export default function ChangeItemDialog({
  entity,
  mode,
  service,
  onSuccess,
}: CommonChangeDialogProps<Item>) {
  const dispatch = useAppDispatch();
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
          <DialogDescription />
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
      <ChangeDialogTabbed<Item>
        changeDialogProps={{
          title: `${mode === "create" ? "إضافة" : "تعديل"} مادة`,
          className: "sm:max-w-7xl",
          formData,
          dialogMode: mode,
          service,
          onSuccess: (data) => onSuccess?.(data, mode),
          validate,
        }}
        tabs={[
          {
            label: "المعلومات الأساسية",
            icon: Box,
            active: true,
            content: <BasicTab />,
          },
          ...(formData.type !== ItemType.Service
            ? [
                {
                  label: "التخزين",
                  icon: Database,
                  active: false,
                  content: <StorageTab />,
                },
              ]
            : []),
          {
            label: "التسعير",
            icon: DollarSign,
            active: false,
            content: <PricingTab />,
          },
        ]}
      />
    </ItemContext.Provider>
  );
}
