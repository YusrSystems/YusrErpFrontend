import { CrudPage } from "@yusr_systems/ui";
import { ClipboardCheck } from "lucide-react";
import { useMemo } from "react";
import { selectPermissionsByResource } from "../../core/auth/authSelectors";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import Stocktaking, { StocktakingFilterColumns, StocktakingSlice } from "../../core/data/stocktaking";
import StocktakingsApiService from "../../core/networking/stocktakingApiService";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ChangeStocktakingDialog from "./changeStocktakingDialog";

export default function StocktakingsPage()
{
  const dispatch = useAppDispatch();
  const stocktakingState = useAppSelector((state) => state.stocktaking);
  const stocktakingDialogState = useAppSelector((state) => state.stocktakingDialog);

  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.Stocktakings)
  );

  const service = useMemo(() => new StocktakingsApiService(), []);

  return (
    <CrudPage<Stocktaking>
      title="جرد المواد"
      entityName="جرد"
      addNewItemTitle="إضافة جرد جديد"
      permissions={ permissions }
      entityState={ stocktakingState }
      useSlice={ () => stocktakingDialogState }
      service={ service }
      cards={ [{
        title: "إجمالي عمليات الجرد",
        data: (stocktakingState.entities?.count ?? 0).toString(),
        icon: <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ StocktakingFilterColumns.columnsNames }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "رقم الجرد", rowStyles: "w-32" },
        { rowName: "التاريخ", rowStyles: "w-32" },
        { rowName: "المستودع", rowStyles: "w-48" },
        { rowName: "الوصف", rowStyles: "" }
      ] }
      tableRowMapper={ (
        stocktaking: Stocktaking
      ) => [
        { rowName: `#${stocktaking.id}`, rowStyles: "" },
        { rowName: new Date(stocktaking.date).toLocaleDateString("ar-SA"), rowStyles: "font-mono" },
        { rowName: stocktaking.storeName, rowStyles: "font-semibold" },
        { rowName: stocktaking.description ?? "-", rowStyles: "text-sm text-gray-500" }
      ] }
      actions={ {
        filter: StocktakingSlice.entityActions.filter,
        openChangeDialog: (entity) => StocktakingSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => StocktakingSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => StocktakingSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => StocktakingSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: StocktakingSlice.entityActions.refresh,
        setCurrentPage: (page) => StocktakingSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeStocktakingDialog
          entity={ stocktakingDialogState.selectedRow || undefined }
          mode={ stocktakingDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(StocktakingSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(StocktakingSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
