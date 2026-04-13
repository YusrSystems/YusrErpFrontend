import { User, UserFilterColumns, UsersApiService } from "@yusr_systems/core";
import { CrudPage } from "@yusr_systems/ui";
import { User2Icon } from "lucide-react";
import { useMemo } from "react";
import { selectPermissionsByResource } from "../../core/auth/authSelectors";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { UserSlice } from "../../core/data/UserLogic";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ChangeUserDialog from "./changeUserDialog";

export default function UsersPage()
{
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const userDialogState = useAppSelector((state) => state.userDialog);
  const permissions = useAppSelector((state) => selectPermissionsByResource(state, SystemPermissionsResources.Users));
  const service = useMemo(() => new UsersApiService(), []);

  return (
    <CrudPage<User>
      title="إدارة المستخدمين"
      entityName="المستخدم"
      addNewItemTitle="إضافة مستخدم جديد"
      permissions={ permissions }
      entityState={ userState }
      useSlice={ () => userDialogState }
      service={ service }
      cards={ [{
        title: "إجمالي المستخدمين",
        data: (userState.entities?.count ?? 0).toString(),
        icon: <User2Icon className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ UserFilterColumns.columnsNames }
      tableHeadRows={ [{ rowName: "", rowStyles: "text-left w-12.5" }, { rowName: "رقم المستخدم", rowStyles: "w-30" }, {
        rowName: "اسم المستخدم",
        rowStyles: "w-70"
      }, { rowName: "هل المستخدم نشط", rowStyles: "" }] }
      tableRowMapper={ (
        user: User
      ) => [{ rowName: `#${user.id}`, rowStyles: "" }, { rowName: user.username, rowStyles: "font-semibold" }, {
        rowName: user.isActive ? "نشط" : "غير نشط",
        rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.isActive ? "bg-green-300" : "bg-red-300"
        } text-slate-800`
      }] }
      actions={ {
        filter: UserSlice.entityActions.filter,
        openChangeDialog: (entity) => UserSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => UserSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => UserSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => UserSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: UserSlice.entityActions.refresh,
        setCurrentPage: (page) => UserSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeUserDialog
          entity={ userDialogState.selectedRow || undefined }
          mode={ userDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(UserSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(UserSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
