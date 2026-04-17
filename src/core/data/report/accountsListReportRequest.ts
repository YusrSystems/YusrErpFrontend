import type { FilterCondition } from "@yusr_systems/core";
import type { AccountType } from "../account";
import type { BaseReportRequest } from "./baseReportRequest";

export class AccountsListReportRequest implements BaseReportRequest
{
  type!: AccountType;
  condition?: FilterCondition;

  constructor(init?: Partial<AccountsListReportRequest>)
  {
    Object.assign(this, init);
  }
}
