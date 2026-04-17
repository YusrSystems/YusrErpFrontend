import { SystemPermissions } from "@yusr_systems/core";
import { CrudPage } from "@yusr_systems/ui";
import { Scale } from "lucide-react";
import { useMemo } from "react";
import { selectPermissionsByResource } from "../../core/auth/authSelectors";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import ItemsSettlement, { ItemsSettlementFilterColumns, ItemsSettlementSlice } from "../../core/data/itemsSettlement";
import ReportConstants from "../../core/data/report/reportConstants";
import ItemsSettlementsApiService from "../../core/networking/itemsSettlementsApiService";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ReportButton from "../reports/reportButton";
import ChangeItemsSettlementDialog from "./changeItemsSettlementDialog";

export default function ItemsSettlementsPage()
{
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const itemsSettlementState = useAppSelector((state) => state.itemsSettlement);
  const itemsSettlementDialogState = useAppSelector((state) => state.itemsSettlementDialog);

  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.ItemsSettlements)
  );

  const service = useMemo(() => new ItemsSettlementsApiService(), []);

  return (
    <CrudPage<ItemsSettlement>
      title="تسوية المواد"
      entityName="تسوية"
      addNewItemTitle="إضافة تسوية جديدة"
      permissions={ permissions }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.ItemsSettlements,
        SystemPermissionsActions.Get
      ) }
      entityState={ itemsSettlementState }
      useSlice={ () => itemsSettlementDialogState }
      service={ service }
      cards={ [{
        title: "إجمالي عمليات التسوية",
        data: (itemsSettlementState.entities?.count ?? 0).toString(),
        icon: <Scale className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ ItemsSettlementFilterColumns.columnsNames }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "رقم التسوية", rowStyles: "w-32" },
        { rowName: "التاريخ", rowStyles: "w-32" },
        { rowName: "المستودع", rowStyles: "w-48" },
        { rowName: "الوصف", rowStyles: "" },
        ...(SystemPermissions.hasAuth(
            authState.loggedInUser?.role?.permissions ?? [],
            SystemPermissionsResources.ReportItemSettlement,
            SystemPermissionsActions.Get
          )
          ? [{ rowName: "", rowStyles: "w-32" }]
          : [])
      ] }
      tableRowMapper={ (
        settlement: ItemsSettlement
      ) => [
        { rowName: `#${settlement.id}`, rowStyles: "" },
        { rowName: new Date(settlement.date).toLocaleDateString("ar-SA"), rowStyles: "font-mono" },
        { rowName: settlement.storeName, rowStyles: "font-semibold" },
        { rowName: settlement.description ?? "-", rowStyles: "text-sm text-gray-500" },
        ...(SystemPermissions.hasAuth(
            authState.loggedInUser?.role?.permissions ?? [],
            SystemPermissionsResources.ReportItemSettlement,
            SystemPermissionsActions.Get
          )
          ? [{
            rowName: (
              <ReportButton
                reportName={ ReportConstants.ItemSettlement }
                request={ { itemSettlementId: settlement.id } }
              />
            ),
            rowStyles: "w-32"
          }]
          : [])
      ] }
      actions={ {
        filter: ItemsSettlementSlice.entityActions.filter,
        openChangeDialog: (entity) => ItemsSettlementSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => ItemsSettlementSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => ItemsSettlementSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => ItemsSettlementSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: ItemsSettlementSlice.entityActions.refresh,
        setCurrentPage: (page) => ItemsSettlementSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeItemsSettlementDialog
          entity={ itemsSettlementDialogState.selectedRow || undefined }
          mode={ itemsSettlementDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(ItemsSettlementSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(ItemsSettlementSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
