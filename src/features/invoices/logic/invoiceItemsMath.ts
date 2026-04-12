import { InvoiceItem, InvoiceRelationType } from "../../../core/data/invoice";
import type { RootState } from "../../../core/state/store";

export default class InvoiceItemsMath
{
  public static GetTaxExclusivePrice(taxIncluded: boolean, price: number, totalTaxesPerc: number): number
  {
    if (taxIncluded)
    {
      return InvoiceItemsMath.CalcTaxExclusivePrice(price, totalTaxesPerc);
    }
    else
    {
      return price;
    }
  }

  public static CalcTaxExclusivePrice(taxInclusivePrice: number, totalTaxesPerc: number)
  {
    return Number((taxInclusivePrice / (100 + totalTaxesPerc) * 100).toFixed(2));
  }

  public static CalcTaxInclusivePrice(taxExclusivePrice: number, totalTaxesPerc: number): number
  {
    return Number(taxExclusivePrice * (100 + totalTaxesPerc) / 100);
  }

  public static CalcTaxExclusiveTotalPrice(
    taxExclusivePrice: number,
    settlement: number,
    qtn: number,
    totalTaxesPerc: number
  )
  {
    return Number(((taxExclusivePrice + (settlement / (100 + totalTaxesPerc) * 100)) * qtn).toFixed(2));
  }

  public static CalcTaxInclusiveTotalPrice(taxInclusivePrice: number, settlement: number, qtn: number)
  {
    return Number(((taxInclusivePrice + settlement) * qtn).toFixed(2));
  }

  public static CalcTotalCost(cost: number, qtn: number)
  {
    return Number((cost * qtn).toFixed(2));
  }

  public static CalcInvoiceTaxExclusivePrice(invoiceItems: InvoiceItem[])
  {
    return invoiceItems.reduce(
      (sum, i) =>
        sum
        + InvoiceItemsMath.CalcTaxExclusiveTotalPrice(
          i.taxExclusivePrice ?? 0,
          i.settlement ?? 0,
          i.quantity ?? 0,
          i.totalTaxesPerc ?? 0
        ),
      0
    ) ?? 0;
  }

  public static CalcInvoiceTaxInclusivePrice(invoiceItems: InvoiceItem[])
  {
    return invoiceItems.reduce(
      (sum, i) =>
        sum
        + InvoiceItemsMath.CalcTaxInclusiveTotalPrice(
          InvoiceItemsMath.CalcTaxInclusivePrice(i.taxExclusivePrice ?? 0, i.totalTaxesPerc ?? 0),
          i.settlement ?? 0,
          i.quantity ?? 0
        ),
      0
    ) ?? 0;
  }
}

export const CalcInvoicePaidPrice = (state: RootState) =>
{
  let paymentVouchers = state.invoiceUI.vouchers.filter((v) => v.invoiceRelationType == InvoiceRelationType.Payment);
  return paymentVouchers?.reduce((sum, i) => sum + (i.amount ?? 0), 0) ?? 0;
};

export const CalcInvoiceUnpaidPrice = (state: RootState) =>
  CalcInvoiceTaxInclusivePrice(state) - CalcInvoicePaidPrice(state);

export const CalcInvoiceTaxExclusivePrice = (state: RootState) =>
{
  return InvoiceItemsMath.CalcInvoiceTaxExclusivePrice(state.invoiceUI.items);
};

export const CalcInvoiceTaxInclusivePrice = (state: RootState) =>
{
  return InvoiceItemsMath.CalcInvoiceTaxInclusivePrice(state.invoiceUI.items);
};
