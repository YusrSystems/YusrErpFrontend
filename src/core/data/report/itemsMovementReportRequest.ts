import type { BaseReportRequest } from "./baseReportRequest";

export class ItemsMovementReportRequest implements BaseReportRequest
{
  transTypeId?: number | null;
  itemId?: number | null;
  fromDate?: Date | null;
  toDate?: Date | null;
  fromAccountId?: number | null;
  toAccountId?: number | null;
  fromStoreId?: number | null;
  toStoreId?: number | null;
  groupOption?: number | null;

  constructor(init?: Partial<ItemsMovementReportRequest>)
  {
    Object.assign(this, init);
  }
}
