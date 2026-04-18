import { Button, DateField, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FormField, SearchableSelect, SelectField } from "@yusr_systems/ui";
import { useState } from "react";
import { AccountFilterColumns, ClientsAndSuppliersSlice } from "../../core/data/account";
import { ItemFilterColumns, ItemSlice } from "../../core/data/item";
import { ItemsMovementReportGroupOption, ItemsMovementReportRequest, ItemsMovementReportTransType } from "../../core/data/report/itemsMovementReportRequest";
import ReportConstants from "../../core/data/report/reportConstants";
import { StoreFilterColumns, StoreSlice } from "../../core/data/store";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ReportButton from "./reportButton";

export default function ItemsMovementDialog()
{
  const dispatch = useAppDispatch();
  const itemState = useAppSelector((state) => state.item);
  const accountState = useAppSelector((state) => state.clientsAndSuppliers);
  const storeState = useAppSelector((state) => state.store);

  const [isOpen, setIsOpen] = useState(false);
  const [transTypeId, setTransTypeId] = useState<ItemsMovementReportTransType | undefined>(undefined);
  const [itemId, setItemId] = useState<number | undefined>(undefined);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [fromAccountId, setFromAccountId] = useState<number | undefined>(undefined);
  const [toAccountId, setToAccountId] = useState<number | undefined>(undefined);
  const [fromStoreId, setFromStoreId] = useState<number | undefined>(undefined);
  const [toStoreId, setToStoreId] = useState<number | undefined>(undefined);
  const [groupOption, setGroupOption] = useState<ItemsMovementReportGroupOption | undefined>(undefined);

  return (
    <>
      <Button variant="outline" size="sm" onClick={ () => setIsOpen(true) }>
        إنشاء
      </Button>
      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent dir="rtl" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>حركة المواد</DialogTitle>
            <DialogDescription>حركات المخزون للمواد</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <SelectField
              label="نوع الحركة"
              value={ transTypeId?.toString() ?? "" }
              onValueChange={ (val) => setTransTypeId(val ? Number(val) as ItemsMovementReportTransType : undefined) }
              options={ [
                { label: "بيع", value: ItemsMovementReportTransType.Sell.toString() },
                { label: "شراء", value: ItemsMovementReportTransType.Purchase.toString() },
                { label: "مرتجع مبيعات", value: ItemsMovementReportTransType.SellReturn.toString() },
                { label: "مرتجع مشتريات", value: ItemsMovementReportTransType.PurchaseReturn.toString() },
                { label: "تحويل", value: ItemsMovementReportTransType.Transfer.toString() },
                { label: "تسوية", value: ItemsMovementReportTransType.Settlement.toString() }
              ] }
            />

            <FormField label="المادة">
              <SearchableSelect
                items={ itemState.entities.data ?? [] }
                itemLabelKey="name"
                itemValueKey="id"
                showAllOption
                value={ itemId?.toString() ?? "" }
                onValueChange={ (val) => setItemId(val ? Number(val) : undefined) }
                columnsNames={ ItemFilterColumns.columnsNames }
                onSearch={ (condition) => dispatch(ItemSlice.entityActions.filter(condition)) }
                disabled={ itemState.isLoading }
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <DateField
                label="من تاريخ"
                value={ fromDate }
                onChange={ (date) => setFromDate(date ?? undefined) }
              />
              <DateField
                label="إلى تاريخ"
                value={ toDate }
                onChange={ (date) => setToDate(date ?? undefined) }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="من حساب">
                <SearchableSelect
                  items={ accountState.entities.data ?? [] }
                  itemLabelKey="name"
                  itemValueKey="id"
                  showAllOption
                  value={ fromAccountId?.toString() ?? "" }
                  onValueChange={ (val) => setFromAccountId(val ? Number(val) : undefined) }
                  columnsNames={ AccountFilterColumns.columnsNames }
                  onSearch={ (condition) => dispatch(ClientsAndSuppliersSlice.entityActions.filter(condition)) }
                  disabled={ accountState.isLoading }
                />
              </FormField>

              <FormField label="إلى حساب">
                <SearchableSelect
                  items={ accountState.entities.data ?? [] }
                  itemLabelKey="name"
                  itemValueKey="id"
                  showAllOption
                  value={ toAccountId?.toString() ?? "" }
                  onValueChange={ (val) => setToAccountId(val ? Number(val) : undefined) }
                  columnsNames={ AccountFilterColumns.columnsNames }
                  onSearch={ (condition) => dispatch(ClientsAndSuppliersSlice.entityActions.filter(condition)) }
                  disabled={ accountState.isLoading }
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="من مستودع">
                <SearchableSelect
                  items={ storeState.entities.data ?? [] }
                  itemLabelKey="name"
                  itemValueKey="id"
                  showAllOption
                  value={ fromStoreId?.toString() ?? "" }
                  onValueChange={ (val) => setFromStoreId(val ? Number(val) : undefined) }
                  columnsNames={ StoreFilterColumns.columnsNames }
                  onSearch={ (condition) => dispatch(StoreSlice.entityActions.filter(condition)) }
                  disabled={ storeState.isLoading }
                />
              </FormField>

              <FormField label="إلى مستودع">
                <SearchableSelect
                  items={ storeState.entities.data ?? [] }
                  itemLabelKey="name"
                  itemValueKey="id"
                  showAllOption
                  value={ toStoreId?.toString() ?? "" }
                  onValueChange={ (val) => setToStoreId(val ? Number(val) : undefined) }
                  columnsNames={ StoreFilterColumns.columnsNames }
                  onSearch={ (condition) => dispatch(StoreSlice.entityActions.filter(condition)) }
                  disabled={ storeState.isLoading }
                />
              </FormField>
            </div>

            <SelectField
              label="تجميع حسب"
              value={ groupOption?.toString() ?? "" }
              onValueChange={ (val) => setGroupOption(val ? Number(val) as ItemsMovementReportGroupOption : undefined) }
              options={ [
                { label: "مادة", value: ItemsMovementReportGroupOption.Item.toString() },
                { label: "من", value: ItemsMovementReportGroupOption.From.toString() },
                { label: "إلى", value: ItemsMovementReportGroupOption.To.toString() },
                { label: "يوم", value: ItemsMovementReportGroupOption.Day.toString() },
                { label: "شهر", value: ItemsMovementReportGroupOption.Month.toString() },
                { label: "سنة", value: ItemsMovementReportGroupOption.Year.toString() }
              ] }
            />
          </div>

          <DialogFooter>
            <ReportButton
              reportName={ ReportConstants.ItemsMovement }
              request={ new ItemsMovementReportRequest({
                transTypeId: transTypeId ?? null,
                itemId: itemId ?? null,
                fromDate: fromDate ?? null,
                toDate: toDate ?? null,
                fromAccountId: fromAccountId ?? null,
                toAccountId: toAccountId ?? null,
                fromStoreId: fromStoreId ?? null,
                toStoreId: toStoreId ?? null,
                groupOption: groupOption ?? null
              }) }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
