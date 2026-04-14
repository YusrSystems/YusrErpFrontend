import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, Loading, useFormErrors, useFormInit, useValidate } from "@yusr_systems/ui";
import { BanknoteArrowDown, BanknoteArrowUp, Box, FolderKanban, Siren } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ChangeDialogTabbed from "../../core/components/changeDialogTabbed";
import { ClientsAndSuppliersSlice } from "../../core/data/account";
import type Invoice from "../../core/data/invoice";
import { InvoiceRelationType, InvoiceSlice, InvoiceStatus, InvoiceType, InvoiceValidationRules } from "../../core/data/invoice";
import { ItemType } from "../../core/data/item";
import { PaymentMethodSlice } from "../../core/data/paymentMethod";
import { StoreSlice } from "../../core/data/store";
import { fetchStoreItems } from "../../core/state/shared/storeItemsSlice";
import { type RootState, useAppDispatch, useAppSelector } from "../../core/state/store";
import { InvoiceContext } from "./logic/invoiceContext";
import InvoiceItemsMath from "./logic/invoiceItemsMath";
import InvoiceBasicTab from "./presentation/basic/invoiceBasicTab";
import InvoiceCostsTab from "./presentation/costs/invoiceCostsTab";
import InvoiceFilesTab from "./presentation/files/invoiceFilesTab";
import InvoicePaymentsTab from "./presentation/payments/invoicePaymentsTab";
import InvoicePolicyTab from "./presentation/policy/invoicePolicyTab";

export type InvoiceSliceType = ReturnType<typeof InvoiceSlice.create>;

export default function ChangeInvoiceDialog({
  entity,
  mode,
  service,
  onSuccess,
  slice,
  fixedType,
  selectFormState
}: CommonChangeDialogProps<Invoice> & {
  slice: InvoiceSliceType;
  stateKey: keyof RootState;
  fixedType?: InvoiceType;
  selectFormState: (state: any) => { formData: Partial<Invoice>; errors: Record<string, string>; };
})
{
  const [initLoading, setInitLoading] = useState(false);
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const invoiceTaxInclusivePrice = () => InvoiceItemsMath.CalcInvoiceTaxInclusivePrice(formData?.invoiceItems ?? []);

  const initialValues = useMemo(
    () => ({
      ...entity,
      type: entity?.type ?? fixedType,
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
      settlementAmount: entity?.settlementAmount ?? 0,
      settlementPercent: entity?.settlementPercent ?? 0,
      paidAmount: entity?.paidAmount ?? 0,
      fullAmount: entity?.fullAmount ?? 0,
      invoiceItems: entity?.invoiceItems ?? [],
      invoiceVouchers: entity?.invoiceVouchers ?? [],
    }),
    [entity]
  );

  const { formData, errors } = useAppSelector(selectFormState);
  const { getError, isInvalid } = useFormErrors(errors);
  const paymentVouchers = () =>
    formData.invoiceVouchers?.filter((v) => v.invoiceRelationType == InvoiceRelationType.Payment) ?? [];
  const { validate } = useValidate(
    formData,
    InvoiceValidationRules.validationRules,
    (errors) => dispatch(slice.formActions.setErrors(errors))
  );
  useFormInit(slice.formActions.setInitialData, initialValues);

  useEffect(() =>
  {
    dispatch(ClientsAndSuppliersSlice.entityActions.filter());
    dispatch(PaymentMethodSlice.entityActions.filter());
    dispatch(StoreSlice.entityActions.filter());
  }, [dispatch]);

  useEffect(() =>
  {
    if (formData.statusId)
    {
      dispatch(fetchStoreItems({
        pageNumber: 1,
        rowsPerPage: 100,
        itemType: ItemType.Product,
        storeId: formData.storeId ?? 0,
        condition: undefined
      }));
    }
  }, [dispatch, formData.storeId]);

  useEffect(() =>
  {
    if (paymentVouchers().length === 0)
    {
      dispatch(slice.formActions.resetPaymentVouchers({}));
      dispatch(slice.formActions.addVoucher(
        {
          voucherId: 0,
          invoiceId: formData.id ?? 0,
          paymentMethodId: authState.setting?.mainPaymentMethodId ?? 0,
          paymentMethodName: authState.setting?.mainPaymentMethodName ?? "",
          accountId: formData.actionAccountId ?? 0,
          accountName: formData.actionAccountName ?? "",
          invoiceRelationType: InvoiceRelationType.Payment,
          amount: invoiceTaxInclusivePrice(),
          amountReceived: invoiceTaxInclusivePrice(),
          description: undefined
        }
      ));
    }
    else if (paymentVouchers().length === 1)
    {
      const updatedVoucher = {
        ...paymentVouchers()[0],
        amount: invoiceTaxInclusivePrice(),
        amountReceived: invoiceTaxInclusivePrice()
      };
      dispatch(slice.formActions.updateVoucher(updatedVoucher));
    }
  }, [formData.invoiceItems]);

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
          dispatch(slice.formActions.setInitialData(res.data));
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
        formData,
        errors,
        getError,
        isInvalid,
        slice,
        mode,
        authState,
        dispatch
      } }
    >
      <ChangeDialogTabbed<Invoice>
        changeDialogProps={ {
          title: `${mode === "create" ? "إنشاء" : "تعديل"} فاتورة`,
          className: "sm:max-w-[90vw]",
          formData,
          dialogMode: mode,
          service,
          onSuccess: (data) => onSuccess?.(data, mode),
          validate
        } }
        tabs={ [{
          label: "المعلومات الأساسية",
          icon: Box,
          active: true,
          content: <InvoiceBasicTab />
        }, {
          label: "سندات الدفع",
          icon: BanknoteArrowDown,
          active: false,
          content: <InvoicePaymentsTab />
        }, {
          label: "تكاليف الفاتورة",
          icon: BanknoteArrowUp,
          active: false,
          content: <InvoiceCostsTab />
        }, {
          label: "سياسة الفاتورة",
          icon: Siren,
          active: false,
          content: <InvoicePolicyTab />
        }, {
          label: "مرفقات الفاتورة",
          icon: FolderKanban,
          active: false,
          content: <InvoiceFilesTab />
        }] }
      />
    </InvoiceContext.Provider>
  );
}
