import type { CommonChangeDialogProps, DialogMode, IEntityState } from "@yusr_systems/ui";
import { Button, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Loading, useFormErrors, useFormInit, useValidate } from "@yusr_systems/ui";
import { BanknoteArrowDown, BanknoteArrowUp, Box, CheckCircle2, FolderKanban, Siren } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ChangeDialogTabbed from "../../core/components/changeDialogTabbed";
import Account, { type AccountSliceType } from "../../core/data/account";
import { FilterByTypeRequest } from "../../core/data/filterByTypeRequest";
import type Invoice from "../../core/data/invoice";
import { InvoiceRelationType, InvoiceReturnStatus, InvoiceSlice, InvoiceStatus, InvoiceType, InvoiceValidationRules, InvoiceVoucher } from "../../core/data/invoice";
import { ItemType } from "../../core/data/item";
import { PaymentMethodSlice } from "../../core/data/paymentMethod";
import { StoreSlice } from "../../core/data/store";
import InvoicesApiService from "../../core/networking/invoiceApiService";
import { fetchStoreItems } from "../../core/state/shared/storeItemsSlice";
import { type RootState, useAppDispatch, useAppSelector } from "../../core/state/store";
import { InvoiceContext } from "./logic/invoiceContext";
import InvoiceItemsMath from "./logic/invoiceItemsMath";
import InvoiceBasicTab from "./presentation/basic/invoiceBasicTab";
import AlertConvertDialog from "./presentation/conversionToSell/alertConvertDialog";
import InvoiceCostsTab from "./presentation/costs/invoiceCostsTab";
import InvoiceFilesTab from "./presentation/files/invoiceFilesTab";
import InvoicePaymentsTab from "./presentation/payments/invoicePaymentsTab";
import InvoicePolicyTab from "./presentation/policy/invoicePolicyTab";

export type InvoiceSliceType = ReturnType<typeof InvoiceSlice.create>;
export type InvoiceDialogMode = DialogMode | "return";

export default function ChangeInvoiceDialog({
  entity,
  mode,
  service,
  onSuccess,
  slice,
  fixedType,
  selectFormState,
  accountSlice,
  accountState
}: Omit<CommonChangeDialogProps<Invoice>, "mode" | "onSuccess"> & {
  mode: InvoiceDialogMode;
  onSuccess?: (data: Invoice, mode: InvoiceDialogMode) => void;
  slice: InvoiceSliceType;
  stateKey: keyof RootState;
  fixedType?: InvoiceType;
  selectFormState: (state: any) => { formData: Partial<Invoice>; errors: Record<string, string>; };
  accountSlice: AccountSliceType;
  accountState: IEntityState<Account>;
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
        ?? ((entity?.type ?? fixedType) === InvoiceType.Purchase
          ? authState.setting?.purchaseAccountId
          : authState.setting?.sellAccountId),
      actionAccountName: entity?.actionAccountName
        ?? ((entity?.type ?? fixedType) === InvoiceType.Purchase
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
      invoiceVouchers: entity?.invoiceVouchers ?? []
    }),
    [entity]
  );

  const { formData, errors } = useAppSelector(selectFormState);
  const { getError, isInvalid } = useFormErrors(errors);
  const [showConfirm, setShowConfirm] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [showWarnings, setShowWarnings] = useState(false);
  const [fullyReturned, setFullyReturned] = useState(false);

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
    dispatch(accountSlice.entityActions.filter());
    dispatch(PaymentMethodSlice.entityActions.filter());
    dispatch(StoreSlice.entityActions.filter());
  }, [dispatch]);

  useEffect(() =>
  {
    if (formData.storeId)
    {
      dispatch(fetchStoreItems({
        pageNumber: 1,
        rowsPerPage: 100,
        storeId: formData.type === InvoiceType.Purchase ? undefined : formData.storeId ?? 0,
        request: new FilterByTypeRequest({ condition: undefined, types: [ItemType.Product, ItemType.Service] })
      }));
    }
  }, [dispatch, formData.storeId]);

  useEffect(() =>
  {
    if (paymentVouchers().length > 1 || mode === "update")
    {
      return;
    }

    if (paymentVouchers().length === 0)
    {
      dispatch(slice.formActions.resetPaymentVouchers({}));
      dispatch(slice.formActions.addVoucher(createInitialPaymentVoucher()));
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
    dispatch(
      slice.formActions.updateFormData({
        fullAmount: invoiceTaxInclusivePrice(),
        paidAmount: invoiceTaxInclusivePrice()
      })
    );
  }, [formData.invoiceItems]);

  useEffect(() =>
  {
    if ((mode === "update" || mode === "return") && entity?.id != undefined)
    {
      setInitLoading(true);

      const getInvoice = async () =>
      {
        let res = undefined;

        if (mode === "update")
        {
          res = await service.Get(entity.id);
        }
        else if (mode === "return")
        {
          res = await new InvoicesApiService().GetReturnInvoiceInitialDetails(entity.id);
        }

        if (res?.data != undefined)
        {
          dispatch(slice.formActions.updateFormData(res.data));
          setFullyReturned(res.data.invoiceItems.length === 0);
        }
        setInitLoading(false);
      };

      getInvoice();
    }
  }, [dispatch, entity?.id]);

  const createInitialPaymentVoucher = (): InvoiceVoucher =>
  {
    return {
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
    } as InvoiceVoucher;
  };

  const convertToSell = async (ignoreWarnings = false) =>
  {
    if (!formData?.id)
    {
      return;
    }

    setInitLoading(true);
    setShowConfirm(false);
    const res = await new InvoicesApiService().ConvertToSell(formData.id, ignoreWarnings, [
      createInitialPaymentVoucher()
    ]);
    if (res.status === 412)
    {
      setWarnings(res.errorDetails?.split("\n") ?? []);
      setShowWarnings(true);
      setInitLoading(false);
      return;
    }

    if (res.data != undefined)
    {
      dispatch(slice.formActions.updateFormData(res.data));
      onSuccess?.(res.data, "update");
    }
    setInitLoading(false);
  };

  const onBeforeSave = async (): Promise<{ handled: boolean; data?: Invoice; }> =>
  {
    if (mode === "return")
    {
      const res = await new InvoicesApiService().Add({
        ...formData,
        type: formData.type === InvoiceType.Sell ? InvoiceType.SellReturn : InvoiceType.PurchaseReturn,
        originalInvoiceId: formData.id,
        id: 0
      } as Invoice);
      return { handled: true, data: res.data as Invoice ?? undefined };
    }

    if (mode === "update" && formData.returnStatusId !== InvoiceReturnStatus.NotReturned)
    {
      toast.warning("لا يمكن تعديل الفاتورة", {
        description: "تم استرجاع بعض بنود هذه الفاتورة، لا يمكن التعديل بعد الإرجاع",
        duration: 3000
      });
      return { handled: true, data: formData as Invoice ?? undefined };
    }

    return { handled: false };
  };

  const isReturn = formData.type === InvoiceType.SellReturn || formData.type === InvoiceType.PurchaseReturn;

  const dialogTitle = mode === "return"
    ? "إضافة مرتجع فاتورة"
    : ((mode === "create" ? "إضافة" : "تعديل") + (isReturn ? " مرتجع فاتورة" : " الفاتورة"));

  if (initLoading)
  {
    return (
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>
            { dialogTitle }
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Loading entityName="الفاتورة" />
      </DialogContent>
    );
  }

  if (fullyReturned)
  {
    return (
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>
            { dialogTitle }
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold">تم الاسترجاع بالكامل</h3>
          <p className="text-sm text-muted-foreground">تم استرجاع جميع بنود هذه الفاتورة مسبقاً</p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">إغلاق</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    );
  }

  const disabled = mode === "update"
    && (formData.type === InvoiceType.Sell || formData.type === InvoiceType.SellReturn
      || formData.type === InvoiceType.PurchaseReturn);

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
        dispatch,
        disabled,
        accountSlice,
        accountState
      } }
    >
      <ChangeDialogTabbed<Invoice>
        changeDialogProps={ {
          title: dialogTitle,
          className: "sm:max-w-[90vw]",
          formData,
          dialogMode: mode as DialogMode,
          service,
          onSuccess: (data) => onSuccess?.(data, mode),
          validate,
          onBeforeSave: onBeforeSave,
          actionButtons: formData.type === InvoiceType.Quotation && mode === "update"
            ? (
              <AlertConvertDialog
                showConfirm={ showConfirm }
                setShowConfirm={ setShowConfirm }
                convertToSell={ convertToSell }
                warnings={ warnings }
                showWarnings={ showWarnings }
                setShowWarnings={ setShowWarnings }
              />
            )
            : undefined
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
