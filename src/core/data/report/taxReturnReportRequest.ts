import type { BaseReportRequest } from "./baseReportRequest";

export class TaxReturnReportRequest implements BaseReportRequest
{
  fromDate: Date;
  toDate: Date;

  constructor(init?: Partial<TaxReturnReportRequest>)
  {
    this.fromDate = new Date();
    this.toDate = new Date();
    Object.assign(this, init);
  }
}
