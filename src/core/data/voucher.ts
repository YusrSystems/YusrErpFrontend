import { BaseEntity, type ColumnName } from "@yusr_systems/core";
import { createGenericDialogSlice, createGenericEntitySlice } from "@yusr_systems/ui";
import type PaymentMethod from "./paymentMethod";
import VouchersApiService from "../networking/voucherApiService";

export const VoucherType = {
  Payment: 1, // سند صرف
  Receipt: 2 // سند قبض
} as const;

export type VoucherType = (typeof VoucherType)[keyof typeof VoucherType];

export default class Voucher extends BaseEntity
{
  public type!: VoucherType;
  public date!: string | Date;
  public amount!: number;
  public amountDue?: number;
  public commissionAmount!: number;
  public accountId!: number;
  public paymentMethodId!: number;
  public description?: string;
  public invoiceId?: number;
  public paymentReason?: string;
  public giver?: string;
  public recipient?: string;
  public notes?: string;

  public accountName?: string;
  public paymentMethod?: PaymentMethod;

  constructor(init?: Partial<Voucher>)
  {
    super();
    Object.assign(this, init);
  }
}

export class VoucherFilterColumns
{
  public static columnsNames: ColumnName[] = [{ label: "رقم السند", value: "Id" }, {
    label: "اسم الحساب",
    value: "AccountName"
  }, { label: "البيان", value: "Description" }];
}

export class VoucherSlice
{
  private static entitySliceInstance = createGenericEntitySlice(
    "voucher",
    new VouchersApiService()
  );

  public static entityActions = VoucherSlice.entitySliceInstance.actions;
  public static entityReducer = VoucherSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<Voucher>("voucherDialog");

  public static dialogActions = VoucherSlice.dialogSliceInstance.actions;
  public static dialogReducer = VoucherSlice.dialogSliceInstance.reducer;
}
