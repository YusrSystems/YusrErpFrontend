import { useInvoiceContext } from "../../logic/invoiceContext";

export default function EmptyTable()
{
  const {
    isInvalid,
    getError
  } = useInvoiceContext();

  return (
    <div
      className={ `flex flex-col items-center justify-center p-10 text-center text-muted-foreground border border-dashed border-border rounded-lg bg-background/50
      ${isInvalid("invoiceItems") ? "error" : ""}
    ` }
    >
      <p>لا توجد مواد مضافة حالياً.</p>
      <p className="text-xs mt-1">قم باختيار مادة من القائمة أو باستخدام الباركود لإضافتها للجدول.</p>
      { isInvalid("invoiceItems") && (
        <div className="text-base font-medium text-red-500 mt-8 animate-in fade-in slide-in-from-top-1">
          { getError("invoiceItems") }
        </div>
      ) }
    </div>
  );
}
