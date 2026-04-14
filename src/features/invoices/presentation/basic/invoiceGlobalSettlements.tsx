import { NumberInput } from "@yusr_systems/ui";
import { Minus, Percent } from "lucide-react";
import { useInvoiceContext } from "../../logic/invoiceContext";

export default function InvoiceGlobalSettlements()
{
  const {
    mode,
    formData,
    dispatch,
    slice
  } = useInvoiceContext();

  const disabled = mode === "update";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 py-2.5 border border-border rounded-lg bg-background rtl shrink-0">
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        مبلغ التسوية العام شامل الضريبة
      </span>

      <div className="hidden sm:block w-px h-7 bg-border shrink-0" />

      <div className="flex items-center gap-2">
        <div className="relative">
          <Minus
            size={ 13 }
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
          />
          <NumberInput
            className="w-28 pr-8"
            value={ formData.settlementAmount ?? 0 }
            onChange={ (newValue) =>
              dispatch(slice.formActions.onInvoiceSettlementAmountChange(Number(newValue) ?? 0)) }
            disabled={ disabled }
          />
        </div>

        <div className="relative">
          <Percent
            size={ 13 }
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <NumberInput
            min={ -100 }
            max={ 100 }
            className="w-28 pr-8"
            value={ formData.settlementPercent ?? 0 }
            onChange={ (newValue) =>
              dispatch(slice.formActions.onInvoiceSettlementPercentChange(Number(newValue) ?? 0)) }
            disabled={ disabled }
          />
        </div>
      </div>
    </div>
  );
}
