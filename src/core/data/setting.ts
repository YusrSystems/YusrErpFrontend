import type { Branch, Currency, StorageFile } from "@yusr_systems/core";
import type { Tax } from "./tax";

export const EInvoicingEnvironmentType = {
  Production: 0,
  Simulation: 1,
  Test: 2,
  NotRegistered: 3
} as const;

export type EInvoicingEnvironmentType = typeof EInvoicingEnvironmentType[keyof typeof EInvoicingEnvironmentType];

export class Setting
{
  public companyName!: string;
  public companyPhone!: string;
  public companyBusinessCategory?: string;
  public email!: string;

  public crn?: string;
  public vatNumber?: string;

  public branchId!: number;
  public branch?: Branch;

  public currencyId!: number;
  public currency!: Currency;

  public mainTaxId!: number;
  public mainTax?: Tax;

  public logo?: StorageFile;
  public invoicePolicy?: string;
  public invoicePrintSize!: number;

  public startDate!: Date;
  public endDate!: Date;
  public eInvoicingEnvironmentType!: EInvoicingEnvironmentType;

  constructor(init?: Partial<Setting>)
  {
    Object.assign(this, init);

    // Ensure dates are actual Date objects if passed as strings
    if (this.startDate)
    {
      this.startDate = new Date(this.startDate);
    }
    if (this.endDate)
    {
      this.endDate = new Date(this.endDate);
    }
  }
}
