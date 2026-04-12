import { InvoiceItem, InvoiceRelationType, InvoiceVoucher } from "../../../core/data/invoice";
import type { InvoiceItemProfitResult } from "../../../core/data/InvoiceItemProfitResult";
import type { InvoiceProfitResult } from "../../../core/data/InvoiceProfitResult";
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
    return Number((taxExclusivePrice * (100 + totalTaxesPerc) / 100).toFixed(2));
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

  public static CalcInvoiceItemProfit(invoiceItem: InvoiceItem): InvoiceItemProfitResult
  {
    const taxInclusivePrice = (invoiceItem.taxInclusivePrice ?? 0) + (invoiceItem.settlement ?? 0);
    const totalTaxesAmount = Number(
      ((invoiceItem.taxInclusivePrice ?? 0) - (invoiceItem.taxExclusivePrice ?? 0)).toFixed(2)
    );
    const profit = Number((taxInclusivePrice - totalTaxesAmount - (invoiceItem.cost ?? 0)).toFixed(2));
    const qtn = invoiceItem.quantity ?? 0;
    return {
      taxInclusivePrice: taxInclusivePrice,
      cost: invoiceItem.cost ?? 0,
      totalTaxesAmount: totalTaxesAmount,
      quantity: qtn,
      profit: profit,
      totalProfit: Number((profit * qtn).toFixed(2))
    };
  }

  public static CalcInvoiceProfit(invoiceItems: InvoiceItem[], invoiceCosts: InvoiceVoucher[]): InvoiceProfitResult
  {
    const invoiceCostsAmount = invoiceCosts.reduce((sum, i) => sum + (i.amount ?? 0), 0) ?? 0;

    let taxInclusiveTotalPrice = 0;
    let totalCost = 0;
    let totalTaxesAmount = 0;
    let profit = 0;

    invoiceItems.forEach((i) =>
    {
      const itemProfit = InvoiceItemsMath.CalcInvoiceItemProfit(i);
      taxInclusiveTotalPrice += itemProfit.taxInclusivePrice;
      totalCost += itemProfit.cost;
      totalTaxesAmount += itemProfit.totalTaxesAmount;
      profit += itemProfit.profit;
    });

    return {
      taxInclusiveTotalPrice: taxInclusiveTotalPrice,
      totalCost: totalCost,
      totalTaxesAmount: totalTaxesAmount,
      invoiceCosts: invoiceCostsAmount,
      profit: profit
    };
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
