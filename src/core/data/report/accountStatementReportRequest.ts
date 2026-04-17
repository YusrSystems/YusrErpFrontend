import type { BaseReportRequest } from "./baseReportRequest";

export class AccountStatementReportRequest implements BaseReportRequest
{
  accountId: number;
  fromDate: Date;
  toDate: Date;

  constructor(init?: Partial<AccountStatementReportRequest>)
  {
    this.accountId = 0;
    this.fromDate = new Date();
    this.toDate = new Date();
    Object.assign(this, init);
  }
}