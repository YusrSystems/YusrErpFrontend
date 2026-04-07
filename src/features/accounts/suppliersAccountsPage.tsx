import { AccountType, SuppliersSlice } from "../../core/data/account";
import AccountsPage from "./accountsPage";

export default function SuppliersAccountsPage()
{
  return (
    <AccountsPage
      title="إدارة حسابات الموردين"
      slice={ SuppliersSlice }
      stateKey="suppliers"
      dialogStateKey="suppliersDialog"
      fixedType={ AccountType.Supplier }
    />
  );
}
