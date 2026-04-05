import { BaseEntity, type ColumnName } from "@yusr_systems/core";
import {
  createGenericDialogSlice,
  createGenericEntitySlice,
} from "@yusr_systems/ui";
import InvoicesApiService from "../networking/invoiceApiService";

export const InvoiceType = {
  Sell: 1,
  Purchase: 2,
  SellReturn: 3,
  Quotation: 4,
  PurchaseReturn: 5,
} as const;

export const InvoiceStatus = {
  Valid: 1,
  Deleted: 2,
} as const;

export const EInvoiceStatus = {
  NotSent: 0,
  SentWithWarnings: 1,
  SentCorrectly: 2,
} as const;

export const InvoiceReturnStatus = {
  NotReturned: 0,
  PartialReturned: 1,
  FullyReturned: 2,
} as const;

export const ImportExportType = {
  Local: 0,
  Export: 1,
  ImportAccordingToTheReverseChargeMechanism: 2,
  ImportPaidForCustoms: 3,
} as const;
export type InvoiceType = (typeof InvoiceType)[keyof typeof InvoiceType];
export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];
export type EInvoiceStatus =
  (typeof EInvoiceStatus)[keyof typeof EInvoiceStatus];
export type InvoiceReturnStatus =
  (typeof InvoiceReturnStatus)[keyof typeof InvoiceReturnStatus];
export type ImportExportType =
  (typeof ImportExportType)[keyof typeof ImportExportType];

export default class Invoice extends BaseEntity {
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

  constructor(init?: Partial<Invoice>) {
    super();
    Object.assign(this, init);
  }

  // Translated C# Method to a TypeScript Getter
  public get isReturnInvoice(): boolean {
    return (
      this.type === InvoiceType.SellReturn ||
      this.type === InvoiceType.PurchaseReturn
    );
  }
}

export class InvoiceFilterColumns {
  public static columnsNames: ColumnName[] = [
    { label: "رقم الفاتورة", value: "Id" },
    { label: "اسم الحساب", value: "ActionAccountName" },
    { label: "المستودع", value: "StoreName" },
    { label: "المندوب", value: "DelegateEmp" },
  ];
}

export class InvoiceSlice {
  private static entitySliceInstance = createGenericEntitySlice(
    "invoice",
    new InvoicesApiService(),
  );

  public static entityActions = InvoiceSlice.entitySliceInstance.actions;
  public static entityReducer = InvoiceSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance =
    createGenericDialogSlice<Invoice>("invoiceDialog");

  public static dialogActions = InvoiceSlice.dialogSliceInstance.actions;
  public static dialogReducer = InvoiceSlice.dialogSliceInstance.reducer;
}
