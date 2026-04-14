import type { PayloadAction } from "@reduxjs/toolkit";
import type { FormState } from "@yusr_systems/ui";
import Invoice, { InvoiceRelationType, InvoiceVoucher } from "../../../core/data/invoice";

export default class InvoiceVouchersActions
{
  public static removeVoucher(state: FormState<Invoice>, action: PayloadAction<number>)
  {
    const id = action.payload;
    state.formData.invoiceVouchers = state.formData.invoiceVouchers?.filter((voucher) => voucher.voucherId !== id);
    delete state.errors[id];
    delete state.errors[`${id}_method`];
  }

  public static updateVoucher(
    state: FormState<Invoice>,
    action: PayloadAction<InvoiceVoucher>
  )
  {
    const index = state.formData.invoiceVouchers?.findIndex((v) => v.voucherId === action.payload.voucherId);
    if (index === -1)
    {
      return;
    }
    if(index != undefined && state.formData.invoiceVouchers != undefined)
      (state.formData.invoiceVouchers)[index] = action.payload;
  }

  public static addVoucher(state: FormState<Invoice>, action: PayloadAction<InvoiceVoucher>)
  {
    const baseVoucher = action.payload;

    const tempId = -(Math.floor(Date.now() / 1000) * 1000 + Math.floor(Math.random() * 1000));

    state.formData.invoiceVouchers?.push({
      invoiceId: baseVoucher.invoiceId,
      voucherId: tempId,
      accountId: baseVoucher.accountId,
      accountName: baseVoucher.accountName,
      invoiceRelationType: baseVoucher.invoiceRelationType,
      paymentMethodId: baseVoucher.paymentMethodId,
      paymentMethodName: baseVoucher.paymentMethodName,
      amount: baseVoucher.amount,
      amountReceived: baseVoucher.amountReceived,
      description: baseVoucher.description
    });
  }

  public static resetPaymentVouchers(state: FormState<Invoice>, _action: PayloadAction<void>)
  {
    state.formData.invoiceVouchers = state.formData.invoiceVouchers?.filter((v) =>
      v.invoiceRelationType !== InvoiceRelationType.Payment
    );
  }
}
