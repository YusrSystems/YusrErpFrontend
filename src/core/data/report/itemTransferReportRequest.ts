import type { BaseReportRequest } from "./baseReportRequest";

export class ItemTransferReportRequest implements BaseReportRequest
{
  itemTransferId: number;

  constructor(init?: Partial<ItemTransferReportRequest>)
  {
    this.itemTransferId = 0;
    Object.assign(this, init);
  }
}
