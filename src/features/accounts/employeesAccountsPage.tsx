import { SystemPermissions } from "@yusr_systems/core";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { AccountType, EmployeesSlice } from "../../core/data/account";
import { useAppSelector } from "../../core/state/store";
import AccountsPage from "./accountsPage";

export default function EmployeesAccountsPage()
{
  const authState = useAppSelector((state) => state.auth);

  return (
    <AccountsPage
      slice={ EmployeesSlice }
      stateKey="employees"
      dialogStateKey="employeesDialog"
      title="إدارة حسابات الموظفين"
      fixedType={ AccountType.Employee }
      selectFormState={ (state) => state.employeesForm }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.AccountEmployee,
        SystemPermissionsActions.Get
      ) }
    />
  );
}
