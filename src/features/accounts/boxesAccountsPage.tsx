import { AccountType } from "../../core/data/account";
import AccountsPage from "./accountsPage";

export default function BoxesAccountsPage()
{
  return <AccountsPage type={ AccountType.Box } title="إدارة الصناديق" />;
}
