import { SystemPermissions } from "@yusr_systems/core";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { AccountType, BanksSlice } from "../../core/data/account";
import { useAppSelector } from "../../core/state/store";
import AccountsPage from "./accountsPage";

export default function BanksAccountsPage()
{
  const authState = useAppSelector((state) => state.auth);

  return (
    <AccountsPage
      slice={ BanksSlice }
      stateKey="banks"
      dialogStateKey="banksDialog"
      title="إدارة حسابات البنوك"
      fixedType={ AccountType.Bank }
      selectFormState={ (state) => state.banksForm }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.AccountBank,
        SystemPermissionsActions.Get
      ) }
    />
  );
}
