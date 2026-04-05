import { AccountType } from "../../core/data/account";
import AccountsPage from "./accountsPage";

export default function EmployeesAccountsPage()
{
  return <AccountsPage type={ AccountType.Employee } title="إدارة الموظفين" />;
}
