import { InvoiceItem, InvoiceRelationType } from "../../../core/data/invoice";
import type { RootState } from "../../../core/state/store";

export default class InvoiceItemsMath
{
  public static GetPriceBeforeTax(taxIncluded: boolean, price: number, totalTaxesPerc: number): number
  {
    console.log(taxIncluded, price, totalTaxesPerc);

    if (taxIncluded)
    {
      return InvoiceItemsMath.CalcPriceBeforeTax(price, totalTaxesPerc);
    }
    else
    {
      return price;
    }
  }

  public static CalcPriceBeforeTax(priceAfterTax: number, totalTaxesPerc: number)
  {
    return Number((priceAfterTax / (100 + totalTaxesPerc) * 100).toFixed(2));
  }

  public static CalcPriceAfterTax(priceBeforeTax: number, totalTaxesPerc: number): number
  {
    return Number(priceBeforeTax * (100 + totalTaxesPerc) / 100);
  }

  public static CalcTotalPriceBeforeTax(priceBeforeTax: number, settlement: number, qtn: number, totalTaxesPerc: number)
  {
    return Number(((priceBeforeTax + (settlement / (100 + totalTaxesPerc) * 100)) * qtn).toFixed(2));
  }

  public static CalcTotalPriceAfterTax(priceAfterTax: number, settlement: number, qtn: number)
  {
    return Number(((priceAfterTax + settlement) * qtn).toFixed(2));
  }

  public static CalcTotalCost(cost: number, qtn: number)
  {
    return Number((cost * qtn).toFixed(2));
  }

  public static CalcInvoicePriceBeforeTax(invoiceItems: InvoiceItem[])
  {
    return invoiceItems.reduce(
      (sum, i) =>
        sum
        + InvoiceItemsMath.CalcTotalPriceBeforeTax(
          i.priceBeforeTax ?? 0,
          i.settlement ?? 0,
          i.quantity ?? 0,
          i.totalTaxesPerc ?? 0
        ),
      0
    ) ?? 0;
  }

  public static CalcInvoicePriceAfterTax(invoiceItems: InvoiceItem[])
  {
    return invoiceItems.reduce(
      (sum, i) =>
        sum
        + InvoiceItemsMath.CalcTotalPriceAfterTax(
          InvoiceItemsMath.CalcPriceAfterTax(i.priceBeforeTax ?? 0, i.totalTaxesPerc ?? 0),
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
  CalcInvoicePriceAfterTax(state) - CalcInvoicePaidPrice(state);

export const CalcInvoicePriceBeforeTax = (state: RootState) =>
{
  return InvoiceItemsMath.CalcInvoicePriceBeforeTax(state.invoiceUI.items);
};

export const CalcInvoicePriceAfterTax = (state: RootState) =>
{
  return InvoiceItemsMath.CalcInvoicePriceAfterTax(state.invoiceUI.items);
};
