import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { InvoiceType } from "../../core/data/invoice";
import InvoicesPage from "./invoicesPage";

export default function SellInvoicesPage()
{
  const { invoiceId } = useParams();

  useEffect(() =>
  {
    if (invoiceId)
    {
      // openInvoiceDialog(invoiceId);
    }
  }, [invoiceId]);
  return <InvoicesPage type={ InvoiceType.Sell } />;
}
