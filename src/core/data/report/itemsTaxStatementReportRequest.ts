import type { BaseReportRequest } from "./baseReportRequest";

export const ItemsTaxStatementReportType = {
  Sales: 0,
  Purchases: 1
} as const;

export type ItemsTaxStatementReportType = typeof ItemsTaxStatementReportType[keyof typeof ItemsTaxStatementReportType];

export class ItemsTaxStatementReportRequest implements BaseReportRequest
{
  type!: ItemsTaxStatementReportType;
  fromDate?: Date | null;
  toDate?: Date | null;
  itemId?: number | null;

  constructor(init?: Partial<ItemsTaxStatementReportRequest>)
  {
    Object.assign(this, init);
  }
}
