import { type PayloadAction } from "@reduxjs/toolkit";
import type { FormState } from "@yusr_systems/ui";
import Invoice, { InvoiceItem } from "../../../core/data/invoice";
import type { StoreItem } from "../../../core/data/item";
import InvoiceItemsMath from "./invoiceItemsMath";

export default class InvoiceItemsActions
{
  public static removeItem(state: FormState<Invoice>, action: PayloadAction<number>)
  {
    const index = action.payload;
    state.formData.invoiceItems?.splice(index, 1);
  }

  public static updateItem(
    state: FormState<Invoice>,
    action: PayloadAction<{ index: number; item: InvoiceItem; }>
  )
  {
    const item = action.payload.item;
    if (state.formData.invoiceItems != undefined)
    {
      state.formData.invoiceItems[action.payload.index] = item;
    }
  }

  public static addItem(state: FormState<Invoice>, action: PayloadAction<StoreItem>)
  {
    const storeItem = action.payload;
    const baseItem = storeItem.item;

    const existingItem = state.formData.invoiceItems?.find((item) => item.itemId === baseItem.id);

    if (existingItem)
    {
      state.formData.invoiceItems = state.formData.invoiceItems?.map((item) =>
        item.itemId === baseItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      return;
    }

    const defaultPricingMethod = storeItem.itemUnitPricingMethods?.find((p) => p.unitId === baseItem.sellUnitId)
      || storeItem.itemUnitPricingMethods?.[0];

    const taxExclusivePrice = InvoiceItemsMath.GetTaxExclusivePrice(
      baseItem.taxIncluded,
      defaultPricingMethod?.price || 0,
      baseItem.totalTaxes || 0
    );
    const taxInclusivePrice = InvoiceItemsMath.CalcTaxInclusivePrice(taxExclusivePrice, baseItem.totalTaxes || 0);

    state.formData.invoiceItems?.push({
      id: 0,
      invoiceId: 0,
      itemId: baseItem.id!,
      itemName: baseItem.name,

      // Pricing Method Details
      itemUnitPricingMethodId: defaultPricingMethod?.id || 0,
      itemUnitPricingMethodName: defaultPricingMethod?.itemUnitPricingMethodName || "",
      itemUnitPricingMethods: storeItem.itemUnitPricingMethods || [],

      // Financials
      quantity: 1,
      originalQuantity: storeItem.storeQuantity || 0,
      cost: baseItem.cost || 0,
      taxExclusivePrice: taxExclusivePrice,
      taxInclusivePrice: taxInclusivePrice,
      originaltaxInclusivePrice: taxInclusivePrice,
      settlement: state.formData.settlementAmount || 0,
      taxExclusiveTotalPrice: taxExclusivePrice,
      taxInclusiveTotalPrice: taxInclusivePrice,

      // Taxes
      taxable: baseItem.taxable || false,
      taxIncluded: baseItem.taxIncluded || false,
      totalTaxesPerc: baseItem.totalTaxes || 0,

      // Misc
      notes: baseItem.description
    });
  }

  public static onInvoiceItemIupmChange(
    state: FormState<Invoice>,
    action: PayloadAction<{ index: number; iupmId: number; }>
  )
  {
    if (state.formData.invoiceItems == undefined)
    {
      return;
    }

    const { index, iupmId } = action.payload;
    let row = state.formData.invoiceItems[index];
    const selectedMethod = row.itemUnitPricingMethods?.find((p) => p.id === iupmId);
    row.itemUnitPricingMethodId = iupmId;
    row.itemUnitPricingMethodName = selectedMethod?.itemUnitPricingMethodName || "";
    row.taxExclusivePrice = InvoiceItemsMath.GetTaxExclusivePrice(
      row.taxIncluded,
      selectedMethod?.price || 0,
      row.totalTaxesPerc || 0
    );
    row.taxInclusivePrice = InvoiceItemsMath.CalcTaxInclusivePrice(row.taxExclusivePrice, row.totalTaxesPerc);
    row.taxExclusiveTotalPrice = InvoiceItemsMath.CalcTaxExclusiveTotalPrice(
      row.taxExclusivePrice,
      row.settlement,
      row.quantity,
      row.totalTaxesPerc
    );
    row.taxInclusiveTotalPrice = InvoiceItemsMath.CalcTaxInclusiveTotalPrice(
      row.taxInclusivePrice,
      row.settlement,
      row.quantity
    );

    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static onInvoiceItemQuantityChange(
    state: FormState<Invoice>,
    action: PayloadAction<{ index: number; newQtn: number | undefined; }>
  )
  {
    if (action.payload.newQtn == undefined || state.formData.invoiceItems == undefined)
    {
      return;
    }
    const { index, newQtn } = action.payload;
    let row = state.formData.invoiceItems[index];
    row.quantity = newQtn!;
    row.taxExclusiveTotalPrice = InvoiceItemsMath.CalcTaxExclusiveTotalPrice(
      row.taxExclusivePrice,
      row.settlement,
      row.quantity,
      row.totalTaxesPerc
    );
    row.taxInclusiveTotalPrice = InvoiceItemsMath.CalcTaxInclusiveTotalPrice(
      row.taxInclusivePrice,
      row.settlement,
      row.quantity
    );

    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static onInvoiceItemSettlementChange(
    state: FormState<Invoice>,
    action: PayloadAction<{ index: number; newSettlement: number | undefined; }>
  )
  {
    if (action.payload.newSettlement == undefined || state.formData.invoiceItems == undefined)
    {
      return;
    }
    const { index, newSettlement } = action.payload;
    let row = state.formData.invoiceItems[index];
    row.settlement = newSettlement || 0;
    row.taxExclusiveTotalPrice = InvoiceItemsMath.CalcTaxExclusiveTotalPrice(
      row.taxExclusivePrice,
      row.settlement,
      row.quantity,
      row.totalTaxesPerc
    );
    row.taxInclusiveTotalPrice = InvoiceItemsMath.CalcTaxInclusiveTotalPrice(
      row.taxInclusivePrice,
      row.settlement,
      row.quantity
    );
    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static onInvoiceItemTaxInclusivePriceChange(
    state: FormState<Invoice>,
    action: PayloadAction<{ index: number; newPrice: number | undefined; }>
  )
  {
    if (action.payload.newPrice == undefined || state.formData.invoiceItems == undefined)
    {
      return;
    }
    const { index, newPrice } = action.payload;
    let row = state.formData.invoiceItems[index];
    row.taxInclusivePrice = newPrice!;
    row.taxExclusivePrice = InvoiceItemsMath.CalcTaxExclusivePrice(newPrice!, row.totalTaxesPerc);
    row.taxExclusiveTotalPrice = InvoiceItemsMath.CalcTaxExclusiveTotalPrice(
      row.taxExclusivePrice,
      row.settlement,
      row.quantity,
      row.totalTaxesPerc
    );
    row.taxInclusiveTotalPrice = InvoiceItemsMath.CalcTaxInclusiveTotalPrice(
      row.taxInclusivePrice,
      row.settlement,
      row.quantity
    );
    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static onInvoiceSettlementAmountChange(state: FormState<Invoice>, action: PayloadAction<number>)
  {
    state.formData.settlementAmount = action.payload || 0;
    state.formData.invoiceItems?.forEach((_, i) =>
      InvoiceItemsActions.onInvoiceItemSettlementChange(state, {
        payload: { index: i, newSettlement: state.formData.settlementAmount },
        type: "onInvoiceItemSettlementChange"
      })
    );
  }

  public static onInvoiceSettlementPercentChange(state: FormState<Invoice>, action: PayloadAction<number>)
  {
    state.formData.settlementPercent = action.payload || 0;
    state.formData.invoiceItems?.forEach((item, i) =>
    {
      const newSettlement = Number(
        (item.taxInclusivePrice * ((state.formData.settlementPercent ?? 0) / 100)).toFixed(2)
      );

      InvoiceItemsActions.onInvoiceItemSettlementChange(state, {
        payload: { index: i, newSettlement: newSettlement },
        type: "onInvoiceItemSettlementChange"
      });
    });
  }
}
