import { SystemPermissions } from "@yusr_systems/core";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { AccountType, BoxesSlice } from "../../core/data/account";
import { useAppSelector } from "../../core/state/store";
import AccountsPage from "./accountsPage";

export default function BoxesAccountsPage()
{
  const authState = useAppSelector((state) => state.auth);

  return (
    <AccountsPage
      slice={ BoxesSlice }
      stateKey="boxes"
      dialogStateKey="boxesDialog"
      title="إدارة حسابات الصناديق"
      fixedType={ AccountType.Box }
      selectFormState={ (state) => state.boxesForm }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.AccountBox,
        SystemPermissionsActions.Get
      ) }
    />
  );
}
