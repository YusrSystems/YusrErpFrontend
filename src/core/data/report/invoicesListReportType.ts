import type { FilterCondition } from "@yusr_systems/core";
import type { BaseReportRequest } from "./baseReportRequest";

export const InvoicesListReportType = {
  InvoicesList: 0,
  ProfitAndLoss: 1
} as const;

export type InvoicesListReportType = typeof InvoicesListReportType[keyof typeof InvoicesListReportType];

export class InvoicesListReportRequest implements BaseReportRequest
{
  condition?: FilterCondition;
  fromDate?: Date | null;
  toDate?: Date | null;
  reportType: InvoicesListReportType;

  constructor(init?: Partial<InvoicesListReportRequest>)
  {
    this.fromDate = null;
    this.toDate = null;
    this.reportType = InvoicesListReportType.InvoicesList;
    Object.assign(this, init);
  }
}
