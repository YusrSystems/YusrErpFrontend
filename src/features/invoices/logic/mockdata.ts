import { InvoiceItem } from "../../../core/data/invoice";
import { ItemUnitPricingMethod } from "../../../core/data/item";

export const mockInvoiceItems: InvoiceItem[] = [
  // Item 1: Standard physical product (Taxable, no discount)
  {
    id: 101,
    invoiceId: 5001,
    itemId: 10,
    itemUnitPricingMethodId: 1,
    quantity: 2,
    cost: 450.00,
    price: 600.00,
    totalPrice: 1200.00, // 2 * 600
    discount: 0,
    taxable: true,
    totalTaxesPerc: 15.0,
    notes: "Serial numbers: SN123, SN124",
    itemName: "Dell UltraSharp 27 Monitor",
    itemUnitPricingMethodName: "Retail - Piece",
    itemUnitPricingMethods: [
      new ItemUnitPricingMethod({
        id: 1,
        itemId: 10,
        unitId: 1,
        unitName: "Piece",
        itemUnitPricingMethodName: "Retail - Piece",
        pricingMethodId: 1,
        pricingMethodName: "Standard Retail",
        quantityMultiplier: 1,
        price: 600.00,
        barcode: "6281234567890"
      }),
      {
        id: 2,
        itemId: 10,
        unitId: 2,
        unitName: "Carton",
        itemUnitPricingMethodName: "Wholesale - Carton",
        pricingMethodId: 2,
        pricingMethodName: "Wholesale",
        quantityMultiplier: 4,
        price: 2300.00,
        barcode: "6281234567891"
      }
    ]
  },

  // Item 2: Hourly Service (Non-taxable, with discount)
  {
    id: 102,
    invoiceId: 5001,
    itemId: 15,
    itemUnitPricingMethodId: 3,
    quantity: 5.5,
    cost: 40.00,
    price: 120.00,
    totalPrice: 610.00, // (5.5 * 120) - 50 discount
    discount: 50.00,
    taxable: false,
    totalTaxesPerc: 0,
    itemName: "Senior IT Consulting",
    itemUnitPricingMethodName: "Standard - Hour",
    itemUnitPricingMethods: [
      new ItemUnitPricingMethod({
        id: 3,
        itemId: 15,
        unitId: 3,
        unitName: "Hour",
        itemUnitPricingMethodName: "Standard - Hour",
        pricingMethodId: 1,
        pricingMethodName: "Standard Retail",
        quantityMultiplier: 1,
        price: 120.00
        // Services usually don't have barcodes
      }),
      {
        id: 4,
        itemId: 15,
        unitId: 4,
        unitName: "Day",
        itemUnitPricingMethodName: "Project - Day",
        pricingMethodId: 3,
        pricingMethodName: "Project Rate",
        quantityMultiplier: 8, // 8 hours in a workday
        price: 850.00
      }
    ]
  },
  {
    id: 103,
    invoiceId: 5001,
    itemId: 22,
    itemUnitPricingMethodId: 5,
    quantity: 12.5,
    cost: 2.50,
    price: 8.00,
    totalPrice: 100.00, // 12.5 * 8
    discount: 0,
    taxable: true,
    totalTaxesPerc: 15.0,
    notes: "Deliver to warehouse B",
    itemName: "Premium Copper Wiring",
    itemUnitPricingMethodName: "Retail - Meter",
    itemUnitPricingMethods: [
      new ItemUnitPricingMethod({
        id: 5,
        itemId: 22,
        unitId: 5,
        unitName: "Meter",
        itemUnitPricingMethodName: "Retail - Meter",
        pricingMethodId: 1,
        pricingMethodName: "Standard Retail",
        quantityMultiplier: 1,
        price: 8.00,
        barcode: "2000000001234" // Internal barcode
      }),
      {
        id: 6,
        itemId: 22,
        unitId: 6,
        unitName: "Roll",
        itemUnitPricingMethodName: "Wholesale - Roll",
        pricingMethodId: 2,
        pricingMethodName: "Wholesale",
        quantityMultiplier: 50, // 50 meters per roll
        price: 350.00,
        barcode: "2000000001235"
      }
    ]
  }
];
