import type { BaseReportRequest } from "./baseReportRequest";

export class BalanceSheetReportRequest implements BaseReportRequest
{
  toDate: Date;

  constructor(init?: Partial<BalanceSheetReportRequest>)
  {
    this.toDate = new Date();
    Object.assign(this, init);
  }
}
