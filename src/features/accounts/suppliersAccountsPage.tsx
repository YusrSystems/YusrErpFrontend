import { AccountType } from "../../core/data/account";
import AccountsPage from "./accountsPage";

export default function SuppliersAccountsPage()
{
  return <AccountsPage type={ AccountType.Supplier } title="إدارة الموردين" />;
}
