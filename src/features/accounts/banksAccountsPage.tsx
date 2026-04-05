import { AccountType } from "../../core/data/account";
import AccountsPage from "./accountsPage";

export default function BanksAccountsPage()
{
  return <AccountsPage type={ AccountType.Bank } title="إدارة البنوك" />;
}
