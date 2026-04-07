import { BaseEntity, type ColumnName } from "@yusr_systems/core";
import { createGenericDialogSlice, createGenericEntitySlice } from "@yusr_systems/ui";
import PaymentMethodsApiService from "../networking/paymentMethodApiService";

export const CommissionType = {
  Percent: 1,
  Amount: 2
} as const;
export type CommissionType = (typeof CommissionType)[keyof typeof CommissionType];

export default class PaymentMethod extends BaseEntity
{
  public name!: string;
  public accountId!: number;
  public accountName!: string;
  public commissionType!: CommissionType;
  public commissionAmount!: number;

  constructor(init?: Partial<PaymentMethod>)
  {
    super();
    Object.assign(this, init);
  }
}

export class PaymentMethodFilterColumns
{
  public static columnsNames: ColumnName[] = [{ label: "رقم طريقة الدفع", value: "Id" }, {
    label: "الاسم",
    value: "Name"
  }, { label: "اسم الحساب", value: "AccountName" }];
}

export class PaymentMethodSlice
{
  private static entitySliceInstance = createGenericEntitySlice(
    "paymentMethod",
    new PaymentMethodsApiService()
  );

  public static entityActions = PaymentMethodSlice.entitySliceInstance.actions;
  public static entityReducer = PaymentMethodSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<PaymentMethod>(
    "paymentMethodDialog"
  );

  public static dialogActions = PaymentMethodSlice.dialogSliceInstance.actions;
  public static dialogReducer = PaymentMethodSlice.dialogSliceInstance.reducer;
}
