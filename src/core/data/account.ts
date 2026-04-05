import { BaseEntity, City, type ColumnName } from "@yusr_systems/core";
import { createGenericDialogSlice, createGenericEntitySlice } from "@yusr_systems/ui";
import AccountsApiService from "../networking/accountApiService";
import { FilterByTypeRequest } from "./filterByTypeRequest";

export const AccountType = {
  Client: 1,
  Supplier: 2,
  Employee: 3,
  Bank: 4,
  Box: 5
} as const;

export type AccountType = typeof AccountType[keyof typeof AccountType];

export class AccountContact extends BaseEntity
{
  public accountId!: number;
  public number!: string;

  constructor(init?: Partial<AccountContact>)
  {
    super();
    Object.assign(this, init);
  }
}

export default class Account extends BaseEntity
{
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

  constructor(init?: Partial<Account>)
  {
    super();
    Object.assign(this, init);
    if (init?.accountContacts)
    {
      this.accountContacts = init.accountContacts.map((c) => new AccountContact(c));
    }
  }
}

export class AccountFilterColumns
{
  public static columnsNames: ColumnName[] = [
    { label: "رقم الحساب", value: "Id" },
    { label: "اسم الحساب", value: "Name" },
    { label: "رقم الحساب البنكي", value: "BankAccountNumber" },
    { label: "الرقم الضريبي", value: "VatNumber" }
  ];
}

// account.ts
export class AccountSlice {
  static create(sliceName: string, types: AccountType[]) {
    const entitySliceInstance = createGenericEntitySlice(
      sliceName,
      new AccountsApiService(),
      (pageNumber, rowsPerPage, condition) =>
        new AccountsApiService().FilterByTypes(
          pageNumber,
          rowsPerPage,
          new FilterByTypeRequest({ types, condition })
        )
    );

    const dialogSliceInstance = createGenericDialogSlice<Account>(sliceName + "Dialog");

    return {
      entityActions: entitySliceInstance.actions,
      entityReducer: entitySliceInstance.reducer,
      dialogActions: dialogSliceInstance.actions,
      dialogReducer: dialogSliceInstance.reducer,
    };
  }
}

export const ClientsSlice = AccountSlice.create("clients", [AccountType.Client]);
export const SuppliersSlice = AccountSlice.create("suppliers", [AccountType.Supplier]);
export const EmployeesSlice = AccountSlice.create("employees", [AccountType.Employee]);
export const BanksSlice = AccountSlice.create("banks", [AccountType.Bank]);
export const BoxesSlice = AccountSlice.create("boxes", [AccountType.Box]);
export const BanksAndBoxesSlice = AccountSlice.create("banksAndBoxes", [AccountType.Box, AccountType.Bank]);
