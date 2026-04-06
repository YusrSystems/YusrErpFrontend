import { CrudPage } from "@yusr_systems/ui";
import { TagIcon } from "lucide-react";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import { selectPermissionsByResource } from "../../core/auth/authSelectors";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import ChangePricingMethodDialog from "./changePricingMethodDialog";
import PricingMethodsApiService from "../../core/networking/PricingMethodsApiService";
import type PricingMethod from "../../core/data/pricingMethod";
import {
  PricingMethodFilterColumns,
  PricingMethodSlice,
} from "../../core/data/pricingMethod";

export default function PricingMethodsPage() {
  const dispatch = useAppDispatch();
  const pricingMethodState = useAppSelector((state) => state.pricingMethod);
  const pricingMethodDialogState = useAppSelector(
    (state) => state.pricingMethodDialog,
  );

  // تأكد من إضافة PricingMethods إلى SystemPermissionsResources في مشروعك
  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(
      state,
      SystemPermissionsResources.PricingMethods,
    ),
  );

  const service = useMemo(() => new PricingMethodsApiService(), []);

  return (
    <CrudPage<PricingMethod>
      title="إدارة طرق التسعير"
      entityName="طريقة التسعير"
      addNewItemTitle="إضافة طريقة تسعير جديدة"
      permissions={permissions}
      entityState={pricingMethodState}
      useSlice={() => pricingMethodDialogState}
      service={service}
      cards={[
        {
          title: "إجمالي طرق التسعير",
          data: (pricingMethodState.entities?.count ?? 0).toString(),
          icon: <TagIcon className="h-4 w-4 text-muted-foreground" />,
        },
      ]}
      columnsToFilter={PricingMethodFilterColumns.columnsNames}
      tableHeadRows={[
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "رقم الطريقة", rowStyles: "w-30" },
        { rowName: "اسم طريقة التسعير", rowStyles: "w-70" },
      ]}
      tableRowMapper={(pricingMethod: PricingMethod) => [
        { rowName: `#${pricingMethod.id}`, rowStyles: "" },
        {
          rowName: pricingMethod.pricingMethodName,
          rowStyles: "font-semibold",
        },
      ]}
      actions={{
        filter: PricingMethodSlice.entityActions.filter,
        openChangeDialog: (entity) =>
          PricingMethodSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) =>
          PricingMethodSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) =>
          PricingMethodSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) =>
          PricingMethodSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: PricingMethodSlice.entityActions.refresh,
        setCurrentPage: (page) =>
          PricingMethodSlice.entityActions.setCurrentPage(page),
      }}
      ChangeDialog={
        <ChangePricingMethodDialog
          entity={pricingMethodDialogState.selectedRow || undefined}
          mode={pricingMethodDialogState.selectedRow ? "update" : "create"}
          service={service}
          onSuccess={(data, mode) => {
            dispatch(PricingMethodSlice.entityActions.refresh({ data: data }));
            if (mode === "create") {
              dispatch(
                PricingMethodSlice.dialogActions.setIsChangeDialogOpen(false),
              );
            }
          }}
        />
      }
    />
  );
}
