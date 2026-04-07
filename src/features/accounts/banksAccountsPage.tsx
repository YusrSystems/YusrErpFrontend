import { AccountType, BanksSlice } from "../../core/data/account";
import AccountsPage from "./accountsPage";

export default function BanksAccountsPage()
{
  return (
    <AccountsPage
      slice={ BanksSlice }
      stateKey="banks"
      dialogStateKey="banksDialog"
      title="إدارة حسابات البنوك"
      fixedType={ AccountType.Bank }
    />
  );
}
