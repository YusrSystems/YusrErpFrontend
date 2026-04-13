import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, Loading, useFormInit, useValidate } from "@yusr_systems/ui";
import { Box, Database, DollarSign } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ChangeDialogTabbed from "../../core/components/changeDialogTabbed";
import Item, { ItemSlice, ItemType, ItemValidationRules } from "../../core/data/item";
import { PricingMethodSlice } from "../../core/data/pricingMethod";
import { StoreSlice } from "../../core/data/store";
import { TaxSlice } from "../../core/data/tax";
import { UnitSlice } from "../../core/data/unit";
import { fetchServiceIds } from "../../core/state/shared/serviceIdsSlice";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import BasicTab from "./basic/basicTab";
import PricingTab from "./pricing/pricingTab";
import StorageTab from "./storage/storageTab";

export default function ChangeItemDialog({
  entity,
  mode,
  service,
  onSuccess
}: CommonChangeDialogProps<Item>)
{
  const dispatch = useAppDispatch();
  const [initLoading, setInitLoading] = useState(false);

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
      itemImages: entity?.itemImages || []
    }),
    [entity]
  );

  const { formData } = useAppSelector((state) => state.itemForm);
  const { validate } = useValidate(
    formData,
    ItemValidationRules.validationRules,
    (errors) => dispatch(ItemSlice.formActions.setErrors(errors))
  );
  useFormInit(ItemSlice.formActions.setInitialData, initialValues);

  useEffect(() =>
  {
    dispatch(TaxSlice.entityActions.filter());
    dispatch(UnitSlice.entityActions.filter());
    dispatch(PricingMethodSlice.entityActions.filter());
    dispatch(StoreSlice.entityActions.filter());
    dispatch(fetchServiceIds());
  }, [dispatch]);

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
          dispatch(ItemSlice.formActions.setInitialData(res.data));
        }
        setInitLoading(false);
      };

      getItem();
    }
  }, [entity?.id, mode]);

  if (initLoading)
  {
    return (
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>
            { mode === "create" ? "إضافة" : "تعديل" } مادة
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Loading entityName="المادة" />
      </DialogContent>
    );
  }

  return (
    <ChangeDialogTabbed<Item>
      changeDialogProps={ {
        title: `${mode === "create" ? "إضافة" : "تعديل"} مادة`,
        className: "sm:max-w-7xl",
        formData,
        dialogMode: mode,
        service,
        onSuccess: (data) => onSuccess?.(data, mode),
        validate
      } }
      tabs={ [
        {
          label: "المعلومات الأساسية",
          icon: Box,
          active: true,
          content: <BasicTab mode={ mode } />
        },
        ...(formData.type !== ItemType.Service
          ? [{
            label: "التخزين",
            icon: Database,
            active: false,
            content: <StorageTab mode={ mode } />
          }]
          : []),
        {
          label: "التسعير",
          icon: DollarSign,
          active: false,
          content: <PricingTab mode={ mode } />
        }
      ] }
    />
  );
}
