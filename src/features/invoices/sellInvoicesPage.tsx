import { InvoiceType } from "../../core/data/invoice";
import InvoicesPage from "./invoicesPage";

export default function SellInvoicesPage()
{
  return <InvoicesPage type={ InvoiceType.Sell } />;
}
