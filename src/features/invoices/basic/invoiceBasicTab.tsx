import { useEffect } from "react";
import { ItemType } from "../../../core/data/item";
import { fetchStoreItems } from "../../../core/state/shared/storeItemsSlice";
import { useAppDispatch } from "../../../core/state/store";
import StoreItemSelector from "../../items/storeItemSelector";
import { useInvoiceContext } from "../invoiceContext";
import { addItem } from "../logic/invoiceSliceUI";
import InvoiceBasicInfo from "./invoiceBasicInfo";
import InvoiceItemsSummary from "./invoiceItemsSummary";
import InvoiceItemsTable from "./invoiceItemsTable";

export default function InvoiceBasicTab()
{
  const dispatch = useAppDispatch();
  const { formData } = useInvoiceContext();
  useEffect(() =>
  {
    if (formData.statusId)
    {
      dispatch(fetchStoreItems({
        pageNumber: 1,
        rowsPerPage: 100,
        itemType: ItemType.Product,
        storeId: formData.storeId ?? 0,
        condition: undefined
      }));
    }
  }, [dispatch, formData.storeId]);
  return (
    <div className="flex flex-col gap-6">
      <InvoiceBasicInfo />
      <StoreItemSelector onSelect={ (item) => dispatch(addItem(item)) } />
      <InvoiceItemsTable />
      <div className="flex">
        <InvoiceItemsSummary />
      </div>
    </div>
  );
}
