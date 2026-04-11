import { InvoiceType } from "../../core/data/invoice";
import InvoicesPage from "./invoicesPage";

export default function PurchaseInvoicesPage()
{
  return <InvoicesPage type={ InvoiceType.Purchase } />;
}
