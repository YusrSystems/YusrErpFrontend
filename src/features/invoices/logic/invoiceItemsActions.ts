import type { PayloadAction } from "@reduxjs/toolkit";
import type { InvoiceType } from "../../../core/data/invoice";
import type { StoreItem } from "../../../core/data/item";
import InvoiceItemsMath from "./invoiceItemsMath";
import type { InvoiceState } from "./invoiceSliceUI";

export default class InvoiceItemsActions
{
  public static removeItem(state: InvoiceState, action: PayloadAction<number>)
  {
    const index = action.payload;
    state.items.splice(index, 1);
  }

  public static updateItem(
    state: InvoiceState,
    action: PayloadAction<{ index: number; item: InvoiceState["items"][0]; }>
  )
  {
    const item = action.payload.item;
    state.items[action.payload.index] = item;
  }

  public static addItem(state: InvoiceState, action: PayloadAction<StoreItem>)
  {
    const storeItem = action.payload;
    const baseItem = storeItem.item;

    const existingItem = state.items.find((item) => item.itemId === baseItem.id);

    if (existingItem)
    {
      state.items = state.items.map((item) =>
        item.itemId === baseItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      return;
    }

    const defaultPricingMethod = storeItem.itemUnitPricingMethods?.find((p) => p.unitId === baseItem.sellUnitId)
      || storeItem.itemUnitPricingMethods?.[0];

    const priceBeforeTax = InvoiceItemsMath.GetPriceBeforeTax(
      baseItem.taxIncluded,
      defaultPricingMethod?.price || 0,
      baseItem.totalTaxes || 0
    );
    const priceAfterTax = InvoiceItemsMath.CalcPriceAfterTax(priceBeforeTax, baseItem.totalTaxes || 0);

    state.items.push({
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
      cost: baseItem.cost || 0,
      priceBeforeTax: priceBeforeTax,
      priceAfterTax: priceAfterTax,
      settlement: state.settlements.amount || 0,
      totalPriceBeforeTax: priceBeforeTax,
      totalPriceAfterTax: priceAfterTax,

      // Taxes
      taxable: baseItem.taxable || false,
      taxIncluded: baseItem.taxIncluded || false,
      totalTaxesPerc: baseItem.totalTaxes || 0,

      // Misc
      notes: baseItem.description
    });
  }

  public static onInvoiceItemIupmChange(
    state: InvoiceState,
    action: PayloadAction<{ index: number; iupmId: number; }>
  )
  {
    const { index, iupmId } = action.payload;
    let row = state.items[index];
    const selectedMethod = row.itemUnitPricingMethods?.find((p) => p.id === iupmId);
    row.itemUnitPricingMethodId = iupmId;
    row.itemUnitPricingMethodName = selectedMethod?.itemUnitPricingMethodName || "";
    row.priceBeforeTax = InvoiceItemsMath.GetPriceBeforeTax(
      row.taxIncluded,
      selectedMethod?.price || 0,
      row.totalTaxesPerc || 0
    );
    row.priceAfterTax = InvoiceItemsMath.CalcPriceAfterTax(row.priceBeforeTax, row.totalTaxesPerc);
    row.totalPriceBeforeTax = InvoiceItemsMath.CalcTotalPriceBeforeTax(
      row.priceBeforeTax,
      row.settlement,
      row.quantity,
      row.totalTaxesPerc
    );
    row.totalPriceAfterTax = InvoiceItemsMath.CalcTotalPriceAfterTax(row.priceAfterTax, row.settlement, row.quantity);

    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static onInvoiceItemQuantityChange(
    state: InvoiceState,
    action: PayloadAction<{ index: number; newQtn: number | undefined; }>
  )
  {
    if (action.payload.newQtn == undefined)
    {
      return;
    }
    const { index, newQtn } = action.payload;
    let row = state.items[index];
    row.quantity = newQtn!;
    row.totalPriceBeforeTax = InvoiceItemsMath.CalcTotalPriceBeforeTax(
      row.priceBeforeTax,
      row.settlement,
      row.quantity,
      row.totalTaxesPerc
    );
    row.totalPriceAfterTax = InvoiceItemsMath.CalcTotalPriceAfterTax(row.priceAfterTax, row.settlement, row.quantity);

    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static onInvoiceItemSettlementChange(
    state: InvoiceState,
    action: PayloadAction<{ index: number; newSettlement: number | undefined; }>
  )
  {
    if (action.payload.newSettlement == undefined)
    {
      return;
    }
    const { index, newSettlement } = action.payload;
    let row = state.items[index];
    row.settlement = newSettlement!;
    row.totalPriceBeforeTax = InvoiceItemsMath.CalcTotalPriceBeforeTax(
      row.priceBeforeTax,
      row.settlement,
      row.quantity,
      row.totalTaxesPerc
    );
    row.totalPriceAfterTax = InvoiceItemsMath.CalcTotalPriceAfterTax(row.priceAfterTax, row.settlement, row.quantity);
    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static onInvoiceItemAfterTaxPriceChange(
    state: InvoiceState,
    action: PayloadAction<{ index: number; newPrice: number | undefined; }>
  )
  {
    if (action.payload.newPrice == undefined)
    {
      return;
    }
    const { index, newPrice } = action.payload;
    let row = state.items[index];
    row.priceAfterTax = newPrice!;
    row.priceBeforeTax = InvoiceItemsMath.CalcPriceBeforeTax(newPrice!, row.totalTaxesPerc);
    row.totalPriceBeforeTax = InvoiceItemsMath.CalcTotalPriceBeforeTax(
      row.priceBeforeTax,
      row.settlement,
      row.quantity,
      row.totalTaxesPerc
    );
    row.totalPriceAfterTax = InvoiceItemsMath.CalcTotalPriceAfterTax(row.priceAfterTax, row.settlement, row.quantity);
    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static resetItems(state: InvoiceState)
  {
    state.items = [];
  }

  public static onInvoiceSettlementAmountChange(state: InvoiceState, action: PayloadAction<number>)
  {
    state.settlements.amount = action.payload;
    state.items.forEach((_, i) =>
      InvoiceItemsActions.onInvoiceItemSettlementChange(state, {
        payload: { index: i, newSettlement: action.payload },
        type: "onInvoiceItemSettlementChange"
      })
    );
  }

  public static onInvoiceSettlementPercentChange(state: InvoiceState, action: PayloadAction<number>)
  {
    console.log(state.settlements);

    state.settlements.percent = action.payload;
    state.items.forEach((item, i) =>
    {
      // Use priceAfterTax (unit price) * quantity as the clean base, never totalPriceAfterTax
      const baseTotalAfterTax = Number((item.priceAfterTax * item.quantity).toFixed(2));
      const newSettlement = Number((baseTotalAfterTax * (action.payload / 100)).toFixed(2));

      InvoiceItemsActions.onInvoiceItemSettlementChange(state, {
        payload: { index: i, newSettlement },
        type: "onInvoiceItemSettlementChange"
      });
    });
  }

  public static setInvoiceType(state: InvoiceState, action: PayloadAction<InvoiceType>)
  {
    state.type = action.payload;
  }
}
