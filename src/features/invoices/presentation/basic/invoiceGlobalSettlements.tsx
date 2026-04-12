import { Minus, Percent } from "lucide-react";
import { NumberInput } from "@yusr_systems/ui";
import { useAppDispatch, useAppSelector } from "../../../../core/state/store";
import { onInvoiceSettlementAmountChange, onInvoiceSettlementPercentChange } from "../../logic/invoiceSliceUI";

export default function InvoiceGlobalSettlements()
{
  const dispatch = useAppDispatch();
  const { settlements, mode } = useAppSelector((state) => state.invoiceUI);
  const disabled = mode === "update";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 py-2.5 border border-border rounded-lg bg-background rtl shrink-0">
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        مبلغ التسوية العام شامل الضريبة
      </span>

      <div className="hidden sm:block w-px h-7 bg-border shrink-0" />

      <div className="flex items-center gap-2">
        <div className="relative">
          <Minus size={ 13 } className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
          <NumberInput
            className="w-28 pr-8"
            value={ settlements.amount ?? 0 }
            onChange={ (newValue) => dispatch(onInvoiceSettlementAmountChange(Number(newValue) ?? 0)) }
            disabled={ disabled }
          />
        </div>

        <div className="relative">
          <Percent size={ 13 } className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <NumberInput
            min={ -100 }
            max={ 100 }
            className="w-28 pr-8"
            value={ settlements.percent ?? 0 }
            onChange={ (newValue) => dispatch(onInvoiceSettlementPercentChange(Number(newValue) ?? 0)) }
            disabled={ disabled }
          />
        </div>
      </div>
    </div>
  );
}