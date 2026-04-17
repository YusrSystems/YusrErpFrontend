import type { BaseReportRequest } from "./baseReportRequest";

export class ItemSettlementReportRequest implements BaseReportRequest
{
  itemSettlementId: number;

  constructor(init?: Partial<ItemSettlementReportRequest>)
  {
    this.itemSettlementId = 0;
    Object.assign(this, init);
  }
}
