import { BaseEntity, type ColumnName, StorageFile } from "@yusr_systems/core";
import { createGenericDialogSlice, createGenericEntitySlice } from "@yusr_systems/ui";
import InvoicesApiService from "../networking/invoiceApiService";
import type { ItemUnitPricingMethod } from "./item";

export const InvoiceType = {
  Sell: 1,
  Purchase: 2,
  SellReturn: 3,
  Quotation: 4,
  PurchaseReturn: 5
} as const;

export const InvoiceStatus = {
  Valid: 1,
  Deleted: 2
} as const;

export const EInvoiceStatus = {
  NotSent: 0,
  SentWithWarnings: 1,
  SentCorrectly: 2
} as const;

export const InvoiceReturnStatus = {
  NotReturned: 0,
  PartialReturned: 1,
  FullyReturned: 2
} as const;

export const ImportExportType = {
  Local: 0,
  Export: 1,
  ImportAccordingToTheReverseChargeMechanism: 2,
  ImportPaidForCustoms: 3
} as const;

export const InvoiceRelationType = {
  Payment: 1,
  Cost: 2
} as const;

export type InvoiceType = (typeof InvoiceType)[keyof typeof InvoiceType];
export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];
export type EInvoiceStatus = (typeof EInvoiceStatus)[keyof typeof EInvoiceStatus];
export type InvoiceReturnStatus = (typeof InvoiceReturnStatus)[keyof typeof InvoiceReturnStatus];
export type ImportExportType = (typeof ImportExportType)[keyof typeof ImportExportType];
export type InvoiceRelationType = (typeof InvoiceRelationType)[keyof typeof InvoiceRelationType];

export class InvoiceItem extends BaseEntity
{
  public invoiceId!: number;
  public itemId!: number;
  public itemUnitPricingMethodId!: number;
  public quantity!: number;
  public cost!: number;
  public price!: number;
  public priceAfterTax !: number;
  public totalPrice!: number;
  public discount!: number;
  public taxable!: boolean;
  public taxIncluded!: boolean;
  public totalTaxesPerc!: number;
  public notes?: string;
  public itemName!: string;
  public itemUnitPricingMethodName!: string;
  public itemUnitPricingMethods: ItemUnitPricingMethod[] = [];

  constructor(init?: Partial<InvoiceItem>)
  {
    super();
    Object.assign(this, init);
  }
}

export class InvoiceVoucher
{
  public invoiceId!: number;
  public voucherId!: number;
  public accountId!: number;
  public accountName!: string;
  public invoiceRelationType!: InvoiceRelationType;
  public paymentMethodId!: number;
  public paymentMethodName!: string;
  public amount!: number;
  public amountReceived?: number;
  public description?: string;

  constructor(init?: Partial<InvoiceVoucher>)
  {
    Object.assign(this, init);
  }
}

export default class Invoice extends BaseEntity
{
  public type!: InvoiceType;
  public originalInvoiceId?: number;
  public date!: string | Date;
  public delegateEmp?: string;
  public statusId!: InvoiceStatus;
  public eInvoiceStatus!: EInvoiceStatus;
  public fullAmount!: number;
  public paidAmount!: number;
  public discountAmount!: number;
  public addedAmount!: number;
  public discountPercent!: number;
  public addedPercent!: number;
  public returnStatusId!: InvoiceReturnStatus;
  public storeId!: number;
  public actionAccountId!: number;
  public notes?: string;
  public policy?: string;
  public importExportType?: ImportExportType;

  public createdAt!: string | Date;
  public createdBy!: number;
  public updatedAt!: string | Date;
  public updatedBy!: number;
  public rowVer!: number;

  public actionAccountName!: string;
  public storeName!: string;

  public invoiceItems: InvoiceItem[] = [];
  public invoiceVouchers: InvoiceVoucher[] = [];
  public invoiceFiles: StorageFile[] = [];
  public ignoreWarnings: boolean = false;

  constructor(init?: Partial<Invoice>)
  {
    super();
    Object.assign(this, init);
  }
}

export class InvoiceFilterColumns
{
  public static columnsNames: ColumnName[] = [
    { label: "رقم الفاتورة", value: "Id" },
    { label: "اسم الحساب", value: "ActionAccountName" },
    { label: "المستودع", value: "StoreName" },
    { label: "المندوب", value: "DelegateEmp" }
  ];
}

export class InvoiceSlice
{
  private static entitySliceInstance = createGenericEntitySlice(
    "invoice",
    new InvoicesApiService()
  );

  public static entityActions = InvoiceSlice.entitySliceInstance.actions;
  public static entityReducer = InvoiceSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<Invoice>("invoiceDialog");

  public static dialogActions = InvoiceSlice.dialogSliceInstance.actions;
  public static dialogReducer = InvoiceSlice.dialogSliceInstance.reducer;
}
