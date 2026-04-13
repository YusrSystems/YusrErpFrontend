import { AccountType, BoxesSlice } from "../../core/data/account";
import AccountsPage from "./accountsPage";

export default function BoxesAccountsPage()
{
  return (
    <AccountsPage
      slice={ BoxesSlice }
      stateKey="boxes"
      dialogStateKey="boxesDialog"
      title="إدارة حسابات الصناديق"
      fixedType={ AccountType.Box }
      actions={ BoxesSlice.formActions }
      selectFormState={ (state) => state.boxesForm }
    />
  );
}
