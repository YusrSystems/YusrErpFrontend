import type { PayloadAction } from "@reduxjs/toolkit";
import { InvoiceRelationType, InvoiceVoucher } from "../../../core/data/invoice";
import type { InvoiceState } from "./invoiceSliceUI";

export default class InvoiceVouchersActions
{
  public static removeVoucher(state: InvoiceState, action: PayloadAction<number>)
  {
    const id = action.payload;
    state.vouchers = state.vouchers.filter((voucher) => voucher.voucherId !== id);
    delete state.errors[id];
    delete state.errors[`${id}_method`];
  }

  public static updateVoucher(
    state: InvoiceState,
    action: PayloadAction<{ index: number; voucher: InvoiceState["vouchers"][0]; }>
  )
  {
    state.vouchers[action.payload.index] = action.payload.voucher;
  }

  public static addVoucher(state: InvoiceState, action: PayloadAction<InvoiceVoucher>)
  {
    const baseVoucher = action.payload;

    const tempId = state.vouchers.length > 0
      ? Math.min(...state.vouchers.map((v) => v.voucherId)) - 1
      : -1;

    state.vouchers.push({
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

  public static resetVouchers(state: InvoiceState)
  {
    state.vouchers = [];
  }

  public static resetPaymentVouchers(state: InvoiceState)
  {
    state.vouchers = state.vouchers.filter((v) => v.invoiceRelationType !== InvoiceRelationType.Payment);
  }

  public static resetCostVouchers(state: InvoiceState)
  {
    state.vouchers = state.vouchers.filter((v) => v.invoiceRelationType !== InvoiceRelationType.Cost);
  }
}
