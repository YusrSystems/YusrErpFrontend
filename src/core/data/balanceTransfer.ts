import { BaseEntity, type ColumnName, type ValidationRule, Validators } from "@yusr_systems/core";
import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "@yusr_systems/ui";
import BalanceTransfersApiService from "../networking/balanceTransferApiService";

export default class BalanceTransfer extends BaseEntity
{
  public description?: string;
  public date!: string | Date;
  public amount!: number;
  public fromAccountId!: number;
  public toAccountId!: number;
  public fromAccountName?: string;
  public toAccountName?: string;

  constructor(init?: Partial<BalanceTransfer>)
  {
    super();
    Object.assign(this, init);
  }
}

export class BalanceTransferFilterColumns
{
  public static columnsNames: ColumnName[] = [{ label: "رقم التحويل", value: "Id" }, {
    label: "البيان",
    value: "Description"
  }];
}

export class BalanceTransferValidationRules
{
  public static validationRules: ValidationRule<Partial<BalanceTransfer>>[] = [{
    field: "amount",
    selector: (d) => d.amount,
    validators: [Validators.required("يرجى إدخال المبلغ")]
  }, {
    field: "date",
    selector: (d) => d.date,
    validators: [Validators.required("يرجى اختيار التاريخ")]
  }, {
    field: "fromAccountId",
    selector: (d) => d.fromAccountId,
    validators: [Validators.required("يرجى اختيار الحساب المحول منه")]
  }, {
    field: "toAccountId",
    selector: (d) => d.toAccountId,
    validators: [Validators.required("يرجى اختيار الحساب المحول إليه")]
  }];
}

export class BalanceTransferSlice
{
  private static entitySliceInstance = createGenericEntitySlice("balanceTransfer", new BalanceTransfersApiService());
  public static entityActions = BalanceTransferSlice.entitySliceInstance.actions;
  public static entityReducer = BalanceTransferSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<BalanceTransfer>("balanceTransferDialog");
  public static dialogActions = BalanceTransferSlice.dialogSliceInstance.actions;
  public static dialogReducer = BalanceTransferSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<BalanceTransfer>("balanceTransferForm");
  public static formActions = BalanceTransferSlice.formSliceInstance.actions;
  public static formReducer = BalanceTransferSlice.formSliceInstance.reducer;
}
