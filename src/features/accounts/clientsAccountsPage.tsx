import { SystemPermissions } from "@yusr_systems/core";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { AccountType, ClientsSlice } from "../../core/data/account";
import { useAppSelector } from "../../core/state/store";
import AccountsPage from "./accountsPage";

export default function ClientsAccountsPage()
{
  const authState = useAppSelector((state) => state.auth);

  return (
    <AccountsPage
      title="إدارة حسابات العملاء"
      slice={ ClientsSlice }
      stateKey="clients"
      dialogStateKey="clientsDialog"
      fixedType={ AccountType.Client }
      selectFormState={ (state) => state.clientsForm }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.AccountClient,
        SystemPermissionsActions.Get
      ) }
    />
  );
}
