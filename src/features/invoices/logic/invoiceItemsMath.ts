import { InvoiceRelationType } from "../../../core/data/invoice";
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
    return Number((priceBeforeTax * (100 + totalTaxesPerc) / 100));
  }

  public static CalcTotalPriceBeforeTax(priceBeforeTax: number, discount: number, qtn: number, totalTaxesPerc: number)
  {
    return Number(((priceBeforeTax - (discount / (100 + totalTaxesPerc) * 100)) * qtn).toFixed(2));
  }

  public static CalcTotalPriceAfterTax(priceAfterTax: number, discount: number, qtn: number)
  {
    return Number(((priceAfterTax - discount) * qtn).toFixed(2));
  }

  public static CalcTotalCost(cost: number, qtn: number)
  {
    return Number((cost * qtn).toFixed(2));
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
  return state.invoiceUI.items?.reduce(
    (sum, i) =>
      sum
      + InvoiceItemsMath.CalcTotalPriceBeforeTax(i.price ?? 0, i.discount ?? 0, i.quantity ?? 0, i.totalTaxesPerc ?? 0),
    0
  ) ?? 0;
};

export const CalcInvoicePriceAfterTax = (state: RootState) =>
{
  return state.invoiceUI.items?.reduce(
    (sum, i) =>
      sum
      + InvoiceItemsMath.CalcTotalPriceAfterTax(
        InvoiceItemsMath.CalcPriceAfterTax(i.price ?? 0, i.totalTaxesPerc ?? 0),
        i.discount ?? 0,
        i.quantity ?? 0
      ),
    0
  ) ?? 0;
};
