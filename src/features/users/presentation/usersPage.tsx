import { selectPermissionsByResource } from "@/app/core/auth/authSelectors";
import { SystemPermissionsResources } from "@/app/core/auth/systemPermissionsResources";
import UsersApiService from "@/app/core/networking/usersApiService";
import { useAppDispatch, useAppSelector } from "@/app/core/state/store";
import { CrudPage } from "@yusr_systems/ui";
import { User2Icon } from "lucide-react";
import { useMemo } from "react";
import User, { UserFilterColumns } from "../data/user";
import { openUserChangeDialog, openUserDeleteDialog, setIsUserChangeDialogOpen, setIsUserDeleteDialogOpen } from "../logic/userDialogSlice";
import { filterUsers, refreshUsers, setCurrentUsersPage } from "../logic/userSlice";
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
        filter: filterUsers,
        openChangeDialog: (entity) => openUserChangeDialog(entity),
        openDeleteDialog: (entity) => openUserDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => setIsUserChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => setIsUserDeleteDialogOpen(open),
        refresh: refreshUsers,
        setCurrentPage: (page) => setCurrentUsersPage(page)
      } }
      ChangeDialog={ 
        <ChangeUserDialog
          entity={ userDialogState.selectedRow || undefined }
          mode={ userDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(refreshUsers({ data: data }));
            if (mode === "create")
            {
              dispatch(setIsUserChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
