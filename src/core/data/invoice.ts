import { BaseEntity, type ColumnName, StorageFile, type ValidationRule, Validators } from "@yusr_systems/core";
import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "@yusr_systems/ui";
import InvoiceItemsActions from "../../features/invoices/logic/invoiceItemsActions";
import InvoiceVouchersActions from "../../features/invoices/logic/invoiceVouchersActions";
import InvoicesApiService from "../networking/invoiceApiService";
import { FilterByTypeRequest } from "./filterByTypeRequest";
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
  public originalQuantity!: number;
  public cost!: number;
  public taxExclusivePrice!: number;
  public taxInclusivePrice!: number;
  public originaltaxInclusivePrice!: number;
  public taxExclusiveTotalPrice!: number;
  public taxInclusiveTotalPrice!: number;
  public settlement!: number;
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
  public settlementAmount!: number;
  public settlementPercent!: number;
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

export class InvoiceValidationRules
{
  public static validationRules: ValidationRule<Partial<Invoice>>[] = [{
    field: "type",
    selector: (d) => d.type,
    validators: [Validators.required("يرجى اختيار نوع الفاتورة")]
  }, {
    field: "date",
    selector: (d) => d.date,
    validators: [Validators.required("يرجى إدخال تاريخ الفاتورة")]
  }, {
    field: "storeId",
    selector: (d) => d.storeId,
    validators: [Validators.required("يرجى تحديد المستودع")]
  }, {
    field: "actionAccountId",
    selector: (d) => d.actionAccountId,
    validators: [Validators.required("يرجى تحديد الحساب")]
  }, {
    field: "invoiceItems",
    selector: (d) => d.invoiceItems,
    validators: [Validators.arrayMinLength(1, ("يرجى إضافة بند واحد على الأقل للفاتورة"))]
  }];
}

export class InvoiceSlice
{
  static create(sliceName: string, types: InvoiceType[])
  {
    const entitySliceInstance = createGenericEntitySlice(
      sliceName,
      new InvoicesApiService(),
      (pageNumber, rowsPerPage, condition) =>
        new InvoicesApiService().FilterByTypes(
          pageNumber,
          rowsPerPage,
          new FilterByTypeRequest({ types, condition })
        )
    );

    const dialogSliceInstance = createGenericDialogSlice<Invoice>(sliceName + "Dialog");
    const formSliceInstance = createGenericFormSlice<Invoice>(sliceName + "Form", undefined, {
      // items
      addItem: InvoiceItemsActions.addItem,
      removeItem: InvoiceItemsActions.removeItem,
      updateItem: InvoiceItemsActions.updateItem,
      onInvoiceItemIupmChange: InvoiceItemsActions.onInvoiceItemIupmChange,
      onInvoiceItemQuantityChange: InvoiceItemsActions.onInvoiceItemQuantityChange,
      onInvoiceItemTaxInclusivePriceChange: InvoiceItemsActions.onInvoiceItemTaxInclusivePriceChange,
      onInvoiceItemSettlementChange: InvoiceItemsActions.onInvoiceItemSettlementChange,
      onInvoiceSettlementAmountChange: InvoiceItemsActions.onInvoiceSettlementAmountChange,
      onInvoiceSettlementPercentChange: InvoiceItemsActions.onInvoiceSettlementPercentChange,

      // vouchers
      addVoucher: InvoiceVouchersActions.addVoucher,
      removeVoucher: InvoiceVouchersActions.removeVoucher,
      updateVoucher: InvoiceVouchersActions.updateVoucher,
      resetPaymentVouchers: InvoiceVouchersActions.resetPaymentVouchers
    });

    return {
      entityActions: entitySliceInstance.actions,
      entityReducer: entitySliceInstance.reducer,
      dialogActions: dialogSliceInstance.actions,
      dialogReducer: dialogSliceInstance.reducer,
      formActions: formSliceInstance.actions,
      formReducer: formSliceInstance.reducer
    };
  }
}

export const SalesSlice = InvoiceSlice.create("sales", [
  InvoiceType.Sell,
  InvoiceType.SellReturn,
  InvoiceType.Quotation
]);
export const PurchasesSlice = InvoiceSlice.create("purchases", [InvoiceType.Purchase, InvoiceType.PurchaseReturn]);
