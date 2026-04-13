import { AccountType, ClientsSlice } from "../../core/data/account";
import AccountsPage from "./accountsPage";

export default function ClientsAccountsPage()
{
  return (
    <AccountsPage
      title="إدارة حسابات العملاء"
      slice={ ClientsSlice }
      stateKey="clients"
      dialogStateKey="clientsDialog"
      fixedType={ AccountType.Client }
      selectFormState={ (state) => state.clientsForm }
    />
  );
}
