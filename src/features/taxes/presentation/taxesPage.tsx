import { CrudPage } from "@yusr_systems/ui";
import { Percent } from "lucide-react";
import { useMemo } from "react";
import { selectPermissionsByResource } from "../../../core/auth/authSelectors";
import { SystemPermissionsResources } from "../../../core/auth/systemPermissionsResources";
import { Tax, TaxFilterColumns } from "../../../core/data/tax";
import TaxesApiService from "../../../core/networking/taxesApiService";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";
import { openTaxChangeDialog, openTaxDeleteDialog, setIsTaxChangeDialogOpen, setIsTaxDeleteDialogOpen } from "../logic/taxDialogSlice";
import { filterTaxes, refreshTaxes, setCurrentTaxesPage } from "../logic/taxSlice";
import ChangeTaxDialog from "./changeTaxDialog";

export default function TaxesPage()
{
  const dispatch = useAppDispatch();
  const taxState = useAppSelector((state) => state.tax);
  const taxDialogState = useAppSelector((state) => state.taxDialog);
  const permissions = useAppSelector((state) => selectPermissionsByResource(state, SystemPermissionsResources.Taxes));
  const service = useMemo(() => new TaxesApiService(), []);

  return (
    <CrudPage<Tax>
      title="إدارة الضرائب"
      entityName="الضريبة"
      addNewItemTitle="إضافة ضريبة جديدة"
      permissions={ permissions }
      entityState={ taxState }
      useSlice={ () => taxDialogState }
      service={ service }
      cards={ [{
        title: "إجمالي الضرائب",
        data: (taxState.entities?.count ?? 0).toString(),
        icon: <Percent className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ TaxFilterColumns.columnsNames }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "رقم الضريبة", rowStyles: "w-30" },
        { rowName: "اسم الضريبة", rowStyles: "w-50" },
        { rowName: "النسبة", rowStyles: "w-30" },
        { rowName: "ضريبة أساسية", rowStyles: "" }
      ] }
      tableRowMapper={ (
        tax: Tax
      ) => [{ rowName: `#${tax.id}`, rowStyles: "" }, { rowName: tax.name, rowStyles: "font-semibold" }, {
        rowName: `%${tax.percentage}`,
        rowStyles: ""
      }, {
        rowName: tax.isPrimary ? "نعم" : "لا",
        rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          tax.isPrimary ? "bg-blue-300" : "bg-gray-200"
        } text-slate-800`
      }] }
      actions={ {
        filter: filterTaxes,
        openChangeDialog: (entity) => openTaxChangeDialog(entity),
        openDeleteDialog: (entity) => openTaxDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => setIsTaxChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => setIsTaxDeleteDialogOpen(open),
        refresh: refreshTaxes,
        setCurrentPage: (page) => setCurrentTaxesPage(page)
      } }
      ChangeDialog={ 
        <ChangeTaxDialog
          entity={ taxDialogState.selectedRow || undefined }
          mode={ taxDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(refreshTaxes({ data: data }));
            if (mode === "create")
            {
              dispatch(setIsTaxChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
