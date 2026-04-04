import { CrudPage } from "@yusr_systems/ui";
import { BoxIcon } from "lucide-react";
import { useMemo } from "react";
import {
  openUnitChangeDialog,
  openUnitDeleteDialog,
  setIsUnitChangeDialogOpen,
  setIsUnitDeleteDialogOpen,
} from "../logic/unitDialogSlice";
import {
  filterUnits,
  refreshUnits,
  setCurrentUnitsPage,
} from "../logic/unitSlice";
import ChangeUnitDialog from "./changeUnitDialog";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";
import { SystemPermissionsResources } from "../../../core/auth/systemPermissionsResources";
import { selectPermissionsByResource } from "../../../core/auth/authSelectors";
import UnitsApiService from "../../../core/networking/unitApiService";
import type Unit from "../../../core/data/units";
import { UnitFilterColumns } from "../../../core/data/units";

export default function UnitsPage() {
  const dispatch = useAppDispatch();
  const unitState = useAppSelector((state) => state.unit);
  const unitDialogState = useAppSelector((state) => state.unitDialog);
  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.Units),
  );
  const service = useMemo(() => new UnitsApiService(), []);

  return (
    <CrudPage<Unit>
      title="إدارة الوحدات"
      entityName="الوحدة"
      addNewItemTitle="إضافة وحدة جديدة"
      permissions={permissions}
      entityState={unitState}
      useSlice={() => unitDialogState}
      service={service}
      cards={[
        {
          title: "إجمالي الوحدات",
          data: (unitState.entities?.count ?? 0).toString(),
          icon: <BoxIcon className="h-4 w-4 text-muted-foreground" />,
        },
      ]}
      columnsToFilter={UnitFilterColumns.columnsNames}
      tableHeadRows={[
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "رقم الوحدة", rowStyles: "w-30" },
        { rowName: "اسم الوحدة", rowStyles: "w-70" },
      ]}
      tableRowMapper={(unit: Unit) => [
        { rowName: `#${unit.id}`, rowStyles: "" },
        { rowName: unit.unitName, rowStyles: "font-semibold" },
      ]}
      actions={{
        filter: filterUnits,
        openChangeDialog: (entity) => openUnitChangeDialog(entity),
        openDeleteDialog: (entity) => openUnitDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => setIsUnitChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => setIsUnitDeleteDialogOpen(open),
        refresh: refreshUnits,
        setCurrentPage: (page) => setCurrentUnitsPage(page),
      }}
      ChangeDialog={
        <ChangeUnitDialog
          entity={unitDialogState.selectedRow || undefined}
          mode={unitDialogState.selectedRow ? "update" : "create"}
          service={service}
          onSuccess={(data, mode) => {
            dispatch(refreshUnits({ data: data }));
            if (mode === "create") {
              dispatch(setIsUnitChangeDialogOpen(false));
            }
          }}
        />
      }
    />
  );
}
