import { BaseEntity, City, type ColumnName } from "@yusr_systems/core";
import { createGenericDialogSlice, createGenericEntitySlice } from "@yusr_systems/ui";
import AccountsApiService from "../networking/accountApiService";

export const AccountType = {
    Client: 1,
    Supplier: 2,
    Employee: 3,
    Bank: 4,
    Box: 5
} as const;

export type AccountType = typeof AccountType[keyof typeof AccountType];

export class AccountContact extends BaseEntity {
  public accountId!: number;
  public contactName?: string;
  public contactNumber!: string;

  constructor(init?: Partial<AccountContact>) {
    super();
    Object.assign(this, init);
  }
}

export default class Account extends BaseEntity {
  public type!: AccountType;
  public name!: string;
  public initialBalance!: number;
  public balance!: number;
  public vatNumber?: string;
  public crn?: string;
  public parentId?: number;
  public parentName?: string;
  public bankAccountNumber?: string;
  public cityId?: number;
  public city?: City;
  public street?: string;
  public district?: string;
  public buildingNumber?: string;
  public postalCode?: string;
  public notes?: string;
  public accountContacts: AccountContact[] = [];

  constructor(init?: Partial<Account>) {
    super();
    Object.assign(this, init);
    if (init?.accountContacts) {
      this.accountContacts = init.accountContacts.map(c => new AccountContact(c));
    }
  }
}

export class AccountFilterColumns {
  public static columnsNames: ColumnName[] = [
    { label: "رقم الحساب", value: "Id" },
    { label: "اسم الحساب", value: "Name" },
    { label: "رقم الحساب البنكي", value: "BankAccountNumber" },
    { label: "الرقم الضريبي", value: "VatNumber" }
  ];
}

export class AccountSlice {
  private static entitySliceInstance = createGenericEntitySlice(
    "account",
    new AccountsApiService()
  );

  public static entityActions = AccountSlice.entitySliceInstance.actions;
  public static entityReducer = AccountSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<Account>("accountDialog");

  public static dialogActions = AccountSlice.dialogSliceInstance.actions;
  public static dialogReducer = AccountSlice.dialogSliceInstance.reducer;
}