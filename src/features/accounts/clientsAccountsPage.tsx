import { AccountType } from "../../core/data/account";
import AccountsPage from "./accountsPage";

export default function ClientsAccountsPage() {
  return (
    <AccountsPage type={AccountType.Client} title="إدارة العملاء"/>
  );
}