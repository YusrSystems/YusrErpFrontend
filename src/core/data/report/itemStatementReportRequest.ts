import type { BaseReportRequest } from "./baseReportRequest";

export class ItemStatementReportRequest implements BaseReportRequest
{
  itemId: number;
  storeId?: number | null;

  constructor(init?: Partial<ItemStatementReportRequest>)
  {
    this.itemId = 0;
    Object.assign(this, init);
  }
}
