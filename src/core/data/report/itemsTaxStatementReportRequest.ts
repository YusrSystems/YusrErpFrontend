import type { BaseReportRequest } from "./baseReportRequest";

export class ItemsTaxStatementReportRequest implements BaseReportRequest
{
  reportType: number;
  fromDate?: Date | null;
  toDate?: Date | null;
  itemId?: number | null;

  constructor(init?: Partial<ItemsTaxStatementReportRequest>)
  {
    this.reportType = 0;
    Object.assign(this, init);
  }
}
