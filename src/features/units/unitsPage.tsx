import { CrudPage } from "@yusr_systems/ui";
import { BoxIcon } from "lucide-react";
import { useMemo } from "react";
import { selectPermissionsByResource } from "../../core/auth/authSelectors";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import type Unit from "../../core/data/unit";
import { UnitFilterColumns, UnitSlice } from "../../core/data/unit";
import UnitsApiService from "../../core/networking/unitApiService";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ChangeUnitDialog from "./changeUnitDialog";

export default function UnitsPage()
{
  const dispatch = useAppDispatch();
  const unitState = useAppSelector((state) => state.unit);
  const unitDialogState = useAppSelector((state) => state.unitDialog);
  const permissions = useAppSelector((state) => selectPermissionsByResource(state, SystemPermissionsResources.Units));
  const service = useMemo(() => new UnitsApiService(), []);

  return (
    <CrudPage<Unit>
      title="إدارة الوحدات"
      entityName="الوحدة"
      addNewItemTitle="إضافة وحدة جديدة"
      permissions={ permissions }
      entityState={ unitState }
      useSlice={ () => unitDialogState }
      service={ service }
      cards={ [{
        title: "إجمالي الوحدات",
        data: (unitState.entities?.count ?? 0).toString(),
        icon: <BoxIcon className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ UnitFilterColumns.columnsNames }
      tableHeadRows={ [{ rowName: "", rowStyles: "text-left w-12.5" }, { rowName: "رقم الوحدة", rowStyles: "w-30" }, {
        rowName: "اسم الوحدة",
        rowStyles: "w-70"
      }] }
      tableRowMapper={ (
        unit: Unit
      ) => [{ rowName: `#${unit.id}`, rowStyles: "" }, { rowName: unit.name, rowStyles: "font-semibold" }] }
      actions={ {
        filter: UnitSlice.entityActions.filter,
        openChangeDialog: (entity) => UnitSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => UnitSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => UnitSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => UnitSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: UnitSlice.entityActions.refresh,
        setCurrentPage: (page) => UnitSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeUnitDialog
          entity={ unitDialogState.selectedRow || undefined }
          mode={ unitDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(UnitSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(UnitSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
