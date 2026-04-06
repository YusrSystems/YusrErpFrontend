import { CrudPage } from "@yusr_systems/ui";
import { Package } from "lucide-react";
import { useMemo } from "react";
import { selectPermissionsByResource } from "../../core/auth/authSelectors";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import Item, { ItemFilterColumns, ItemSlice, ItemType } from "../../core/data/item";
import ItemsApiService from "../../core/networking/itemApiService";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ChangeItemDialog from "./changeItemDialog";
export default function ItemsPage()
{
  const dispatch = useAppDispatch();
  const itemState = useAppSelector((state) => state.item);
  const itemDialogState = useAppSelector((state) => state.itemDialog);

  const permissions = useAppSelector((state) => selectPermissionsByResource(state, SystemPermissionsResources.Items));

  const service = useMemo(() => new ItemsApiService(), []);

  return (
    <CrudPage<Item>
      title="إدارة الأصناف"
      entityName="صنف"
      addNewItemTitle="إضافة صنف جديد"
      permissions={ permissions }
      entityState={ itemState }
      useSlice={ () => itemDialogState }
      service={ service }
      cards={ [{
        title: "إجمالي الأصناف",
        data: (itemState.entities?.count ?? 0).toString(),
        icon: <Package className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ ItemFilterColumns.columnsNames }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "النوع", rowStyles: "w-24" },
        { rowName: "اسم الصنف", rowStyles: "w-48" },
        { rowName: "التصنيف", rowStyles: "w-32" },
        { rowName: "الكمية", rowStyles: "w-24" },
        { rowName: "التكلفة", rowStyles: "w-24" }
      ] }
      tableRowMapper={ (item: Item) => [
        { rowName: `#${item.id}`, rowStyles: "" },
        {
          rowName: item.type === ItemType.Product ? "منتج" : "خدمة",
          rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.type === ItemType.Product ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
          }`
        },
        { rowName: item.name, rowStyles: "font-semibold" },
        { rowName: item.class ?? "-", rowStyles: "text-sm text-gray-500" },
        { rowName: item.quantity?.toString() ?? "0", rowStyles: "font-mono" },
        { rowName: item.cost?.toLocaleString() ?? "0", rowStyles: "font-mono text-green-600" }
      ] }
      actions={ {
        filter: ItemSlice.entityActions.filter,
        openChangeDialog: (entity) => ItemSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => ItemSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => ItemSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => ItemSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: ItemSlice.entityActions.refresh,
        setCurrentPage: (page) => ItemSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeItemDialog
          entity={ itemDialogState.selectedRow || undefined }
          mode={ itemDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(ItemSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(ItemSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
