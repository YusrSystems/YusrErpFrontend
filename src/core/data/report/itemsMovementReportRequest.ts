import type { BaseReportRequest } from "./baseReportRequest";

export const ItemsMovementReportTransType = {
  Sell: 1,
  Purchase: 2,
  SellReturn: 3,
  PurchaseReturn: 5,
  Transfer: 6,
  Settlement: 7
} as const;

export type ItemsMovementReportTransType =
  typeof ItemsMovementReportTransType[keyof typeof ItemsMovementReportTransType];

export const ItemsMovementReportGroupOption = {
  Item: 1,
  From: 2,
  To: 3,
  Day: 5,
  Month: 6,
  Year: 7
} as const;

export type ItemsMovementReportGroupOption =
  typeof ItemsMovementReportGroupOption[keyof typeof ItemsMovementReportGroupOption];

export class ItemsMovementReportRequest implements BaseReportRequest
{
  transTypeId?: ItemsMovementReportTransType | null;
  itemId?: number | null;
  fromDate?: Date | null;
  toDate?: Date | null;
  fromAccountId?: number | null;
  toAccountId?: number | null;
  fromStoreId?: number | null;
  toStoreId?: number | null;
  groupOption?: ItemsMovementReportGroupOption | null;

  constructor(init?: Partial<ItemsMovementReportRequest>)
  {
    Object.assign(this, init);
  }
}
