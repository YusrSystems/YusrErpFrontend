import { NumberInput } from "@yusr_systems/ui";
import { Minus, Percent } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../core/state/store";
import { onInvoiceSettlementAmountChange, onInvoiceSettlementPercentChange } from "../../logic/invoiceSliceUI";

export default function InvoiceGlobalSettlements()
{
  const dispatch = useAppDispatch();
  const { settlements, mode } = useAppSelector((state) => state.invoiceUI);

  return (
    <div className="flex px-3 gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium">مبلغ التسوية العام شامل الضريبة</h3>
        <div className="flex items-center gap-2">
          <div className="relative max-w-30">
            <Minus
              size={ 14 }
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <NumberInput
              className="max-w-30 pr-8"
              value={ settlements.amount ?? 0 }
              onChange={ (newValue) => dispatch(onInvoiceSettlementAmountChange(Number(newValue) ?? 0)) }
              disabled={ mode === "update" }
            />
          </div>
          <div className="relative max-w-30">
            <NumberInput
              min={ -100 }
              max={ 100 }
              className="max-w-30 pr-8"
              value={ settlements.percent ?? 0 }
              onChange={ (newValue) => dispatch(onInvoiceSettlementPercentChange(Number(newValue) ?? 0)) }
              disabled={ mode === "update" }
            />
            <Percent
              size={ 14 }
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
