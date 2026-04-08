import type { Branch, Currency, StorageFile } from "@yusr_systems/core";
import type { Tax } from "./tax";

export const EInvoicingEnvironmentType = {
  Production: 0,
  Simulation: 1,
  Test: 2,
  NotRegistered: 3
} as const;

export type EInvoicingEnvironmentType = typeof EInvoicingEnvironmentType[keyof typeof EInvoicingEnvironmentType];

export const InvoicePrintSize = {
  A4: 0,
  ThermalPrinter: 1
} as const;

export type InvoicePrintSize = typeof InvoicePrintSize[keyof typeof InvoicePrintSize];

export class Setting {
  public email!: string;
  public companyName!: string;
  public companyPhone!: string;
  public companyBusinessCategory?: string;
  public crn?: string;
  public vatNumber?: string;
  
  public currencyId!: number;
  public currency?: Currency;
  
  public logo?: StorageFile;
  
  public startDate!: Date;
  public endDate!: Date;

  public branchId!: number;
  public branch?: Branch;
  
  public mainTaxId!: number;
  public mainTax?: Tax;

  public sellAccountId?: number;
  public sellAccountName?: string;
  
  public purchaseAccountId?: number;
  public purchaseAccountName?: string;
  
  public mainPaymentMethodId?: number;
  public mainPaymentMethodName?: string;
  
  public mainStoreId?: number;
  public mainStoreName?: string;
  
  public invoicePolicy?: string;
  public invoicePrintSize!: InvoicePrintSize;
  public eInvoicingEnvironmentType!: EInvoicingEnvironmentType;

  constructor(init?: Partial<Setting>) {
    Object.assign(this, init);

    if (this.startDate) {
      this.startDate = new Date(this.startDate);
    }
    if (this.endDate) {
      this.endDate = new Date(this.endDate);
    }
  }
}