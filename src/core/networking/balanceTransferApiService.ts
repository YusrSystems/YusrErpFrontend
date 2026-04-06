import { BaseApiService } from "@yusr_systems/core";
import type BalanceTransfer from "../data/balanceTransfer";

export default class BalanceTransfersApiService extends BaseApiService<BalanceTransfer> {
  routeName: string = "BalanceTransfers";
}