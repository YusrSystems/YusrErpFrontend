import { CrudPage, type IDialogState, type IEntityState } from "@yusr_systems/ui";
import { WalletIcon } from "lucide-react";
import { useMemo } from "react";
import { selectPermissionsByResource } from "../../core/auth/authSelectors";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import Account, { AccountFilterColumns, AccountSlice, AccountType } from "../../core/data/account";
import AccountsApiService from "../../core/networking/accountApiService";
import { type RootState, useAppDispatch, useAppSelector } from "../../core/state/store";
import ChangeAccountDialog from "./changeAccountDialog";

export default function AccountsPage({
  title,
  slice,
  stateKey,
  dialogStateKey,
  fixedType
}: {
  title: string;
  slice: ReturnType<typeof AccountSlice.create>;
  stateKey: keyof RootState;
  dialogStateKey: keyof RootState;
  fixedType?: AccountType;
})
{
  const dispatch = useAppDispatch();
  const accountState = useAppSelector((state) => state[stateKey] as IEntityState<Account>);
  const accountDialogState = useAppSelector((state) => state[dialogStateKey] as IDialogState<Account>);

  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.Accounts)
  );

  const service = useMemo(() => new AccountsApiService(), []);

  return (
    <CrudPage<Account>
      title={ title }
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
      tableHeadRows={ [{ rowName: "", rowStyles: "text-left w-12.5" }, { rowName: "رقم الحساب", rowStyles: "w-24" }, {
        rowName: "اسم الحساب",
        rowStyles: "w-40"
      }, { rowName: "الرصيد", rowStyles: "w-32" }] }
      tableRowMapper={ (
        account: Account
      ) => [{ rowName: `#${account.id}`, rowStyles: "" }, { rowName: account.name, rowStyles: "font-semibold" }, {
        rowName: account.balance?.toLocaleString() ?? "0",
        rowStyles: "font-mono"
      }] }
      actions={ {
        filter: slice.entityActions.filter,
        openChangeDialog: (entity) => slice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => slice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => slice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => slice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: slice.entityActions.refresh,
        setCurrentPage: (page) => slice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeAccountDialog
          entity={ accountDialogState.selectedRow || undefined }
          mode={ accountDialogState.selectedRow ? "update" : "create" }
          service={ service }
          slice={ slice }
          stateKey={ stateKey }
          fixedType={ fixedType }
          onSuccess={ (data, mode) =>
          {
            dispatch(slice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(slice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
