import { AccountType, EmployeesSlice } from "../../core/data/account";
import AccountsPage from "./accountsPage";

export default function EmployeesAccountsPage()
{
  return (
    <AccountsPage
      slice={ EmployeesSlice }
      stateKey="employees"
      dialogStateKey="employeesDialog"
      title="إدارة حسابات الموظفين"
      fixedType={ AccountType.Employee }
      actions={ EmployeesSlice.formActions }
      selectFormState={ (state) => state.employeesForm }
    />
  );
}
