import { BaseEntity, type ColumnName } from "@yusr_systems/core";
import { createGenericDialogSlice, createGenericEntitySlice } from "@yusr_systems/ui";
import BalanceTransfersApiService from "../networking/balanceTransferApiService";

export default class BalanceTransfer extends BaseEntity {
  public description?: string;
  public date!: string | Date;
  public amount!: number;
  public fromAccountId!: number;
  public toAccountId!: number;
  public fromAccountName?: string;
  public toAccountName?: string;

  constructor(init?: Partial<BalanceTransfer>) {
    super();
    Object.assign(this, init);
  }
}

export class BalanceTransferFilterColumns {
  public static columnsNames: ColumnName[] = [
    { label: "رقم التحويل", value: "Id" },
    { label: "البيان", value: "Description" }
  ];
}

export class BalanceTransferSlice {
  private static entitySliceInstance = createGenericEntitySlice(
    "balanceTransfer",
    new BalanceTransfersApiService()
  );

  public static entityActions = BalanceTransferSlice.entitySliceInstance.actions;
  public static entityReducer = BalanceTransferSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<BalanceTransfer>("balanceTransferDialog");

  public static dialogActions = BalanceTransferSlice.dialogSliceInstance.actions;
  public static dialogReducer = BalanceTransferSlice.dialogSliceInstance.reducer;
}