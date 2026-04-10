import { type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Loading, useEntityForm } from "@yusr_systems/ui";
import { useEffect, useMemo, useState } from "react";
import { ClientsAndSuppliersSlice } from "../../core/data/account";
import type Invoice from "../../core/data/invoice";
import { InvoiceStatus, InvoiceType } from "../../core/data/invoice";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import { filterStores } from "../stores/logic/storeSlice";
import InvoiceBasicInfo from "./invoiceBasicInfo";
import { InvoiceContext } from "./invoiceContext";
import InvoiceItemsSummary from "./invoiceItemsSummary";

export default function ChangeInvoiceDialog({
  entity,
  mode,
  service,
  onSuccess
}: CommonChangeDialogProps<Invoice>)
{
  const [initLoading, setInitLoading] = useState(false);
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const validationRules: ValidationRule<Partial<Invoice>>[] = useMemo(
    () => [{
      field: "type",
      selector: (d) => d.type,
      validators: [Validators.required("يرجى اختيار نوع الفاتورة")]
    }, {
      field: "date",
      selector: (d) => d.date,
      validators: [Validators.required("يرجى إدخال تاريخ الفاتورة")]
    }, {
      field: "storeId",
      selector: (d) => d.storeId,
      validators: [Validators.required("يرجى تحديد المستودع")]
    }, {
      field: "actionAccountId",
      selector: (d) => d.actionAccountId,
      validators: [Validators.required("يرجى تحديد الحساب")]
    }],
    []
  );

  const initialValues = useMemo(
    () => ({
      ...entity,
      type: entity?.type ?? InvoiceType.Sell,
      actionAccountId: entity?.actionAccountId
        ?? (entity?.type === InvoiceType.Purchase
          ? authState.setting?.purchaseAccountId
          : authState.setting?.sellAccountId),
      actionAccountName: entity?.actionAccountName
        ?? (entity?.type === InvoiceType.Purchase
          ? authState.setting?.purchaseAccountName
          : authState.setting?.sellAccountName),
      storeId: entity?.storeId ?? authState.setting?.mainStoreId,
      storeName: entity?.storeName ?? authState.setting?.mainStoreName,
      statusId: entity?.statusId ?? InvoiceStatus.Valid,
      date: entity?.date
        ? new Date(entity.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      discountAmount: entity?.discountAmount ?? 0,
      addedAmount: entity?.addedAmount ?? 0,
      paidAmount: entity?.paidAmount ?? 0,
      fullAmount: entity?.fullAmount ?? 0
    }),
    [entity]
  );

  const { formData, handleChange, getError, clearError, isInvalid, validate } = useEntityForm<Invoice>(
    initialValues,
    validationRules
  );

  useEffect(() =>
  {
    dispatch(ClientsAndSuppliersSlice.entityActions.filter());
    dispatch(filterStores());
  }, [dispatch]);

  useEffect(() =>
  {
    if (mode === "update" && entity?.id)
    {
      setInitLoading(true);

      const getItem = async () =>
      {
        const res = await service.Get(entity.id);
        handleChange({ ...res.data });
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
            { mode === "create" ? "إضافة" : "تعديل" } الفاتورة
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Loading entityName="الفاتورة" />
      </DialogContent>
    );
  }

  return (
    <InvoiceContext.Provider
      value={ {
        mode,
        formData,
        handleChange,
        isInvalid,
        getError,
        clearError
      } }
    >
      <ChangeDialog<Invoice>
        title={ `${mode === "create" ? "إنشاء" : "تعديل"} فاتورة` }
        className="sm:max-w-[90vw]"
        dialogMode={ mode }
        formData={ formData }
        service={ service }
        disable={ () => false }
        onSuccess={ (data) => onSuccess?.(data, mode) }
        validate={ validate }
      >
        <div className="flex flex-col gap-6">
          <InvoiceBasicInfo />

          <div className="flex">
            <InvoiceItemsSummary />
          </div>
        </div>
      </ChangeDialog>
    </InvoiceContext.Provider>
  );
}
