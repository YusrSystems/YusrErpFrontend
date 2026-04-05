import { CrudPage } from "@yusr_systems/ui";
import { WalletIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { selectPermissionsByResource } from "../../core/auth/authSelectors";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import Account, { AccountFilterColumns, AccountSlice, AccountType } from "../../core/data/account";
import AccountsApiService from "../../core/networking/accountApiService";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ChangeAccountDialog from "./changeAccountDialog";

export default function AccountsPage({ type, title }: { type: AccountType, title: string })
{
  const dispatch = useAppDispatch();
  const accountState = useAppSelector((state) => state.account);
  const accountDialogState = useAppSelector((state) => state.accountDialog);

  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.Accounts)
  );

  useEffect(() => {
    dispatch(AccountSlice.entityActions.setFilterTypes([type]));
  }, []);

  const service = useMemo(() => new AccountsApiService(), []);

  return (
    <CrudPage<Account>
      title={title}
      entityName="الحساب"
      addNewItemTitle="إضافة حساب جديد"
      permissions={ permissions }
      entityState={ accountState }
      useSlice={ () => accountDialogState }
      service={ service }
      cards={ [{
        title: "إجمالي الحسابات",
        data: (accountState.entities?.count ?? 0).toString(),
        icon: <WalletIcon className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ AccountFilterColumns.columnsNames }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "رقم الحساب", rowStyles: "w-24" },
        { rowName: "اسم الحساب", rowStyles: "w-40" },
        { rowName: "الرصيد", rowStyles: "w-32" }
      ] }
      tableRowMapper={ (
        account: Account
      ) => [{ rowName: `#${account.id}`, rowStyles: "" }, { rowName: account.name, rowStyles: "font-semibold" }, { rowName: account.balance?.toLocaleString() ?? "0", rowStyles: "font-mono" }] }
      actions={ {
        filter: AccountSlice.entityActions.filter,
        openChangeDialog: (entity) => AccountSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => AccountSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => AccountSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => AccountSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: AccountSlice.entityActions.refresh,
        setCurrentPage: (page) => AccountSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeAccountDialog
          entity={ accountDialogState.selectedRow || undefined }
          mode={ accountDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(AccountSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(AccountSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
