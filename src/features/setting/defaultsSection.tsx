import { FieldGroup, FieldsSection, SearchableSelect } from "@yusr_systems/ui";
import { AccountFilterColumns, ClientsAndSuppliersSlice } from "../../core/data/account";
import { PaymentMethodFilterColumns, PaymentMethodSlice } from "../../core/data/paymentMethod";
import { StoreFilterColumns, StoreSlice } from "../../core/data/store";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import { useSettingContext } from "./settingContext";

export default function DefaultsSection()
{
  const {
    formData,
    handleChange
  } = useSettingContext();

  const dispatch = useAppDispatch();
  const storeState = useAppSelector((state) => state.store);
  const paymentMethodState = useAppSelector((state) => state.paymentMethod);
  const accountState = useAppSelector((state) => state.clientsAndSuppliers);

  return (
    <div className="space-y-10 animate-in fade-in">
      <FieldGroup>
        <FieldsSection title="الحسابات والمستودعات الافتراضية" columns={ 2 }>
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">المستودع الافتراضي</label>
            <SearchableSelect
              items={ storeState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              value={ formData.mainStoreId?.toString() || "" }
              onValueChange={ (val) =>
              {
                const selected = storeState.entities.data?.find((s) => s.id.toString() === val);
                handleChange({ mainStoreId: selected?.id, mainStoreName: selected?.name });
              } }
              columnsNames={ StoreFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(StoreSlice.entityActions.filter(condition)) }
              disabled={ storeState.isLoading }
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">طريقة الدفع الافتراضية</label>
            <SearchableSelect
              items={ paymentMethodState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              value={ formData.mainPaymentMethodId?.toString() || "" }
              onValueChange={ (val) =>
              {
                const selected = paymentMethodState.entities.data?.find((p) => p.id.toString() === val);
                handleChange({ mainPaymentMethodId: selected?.id, mainPaymentMethodName: selected?.name });
              } }
              columnsNames={ PaymentMethodFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(PaymentMethodSlice.entityActions.filter(condition)) }
              disabled={ paymentMethodState.isLoading }
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">حساب المبيعات الافتراضي</label>
            <SearchableSelect
              items={ accountState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              value={ formData.sellAccountId?.toString() || "" }
              onValueChange={ (val) =>
              {
                const selected = accountState.entities.data?.find((a) => a.id.toString() === val);
                handleChange({ sellAccountId: selected?.id, sellAccountName: selected?.name });
              } }
              columnsNames={ AccountFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(ClientsAndSuppliersSlice.entityActions.filter(condition)) }
              disabled={ accountState.isLoading }
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">حساب المشتريات الافتراضي</label>
            <SearchableSelect
              items={ accountState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              value={ formData.purchaseAccountId?.toString() || "" }
              onValueChange={ (val) =>
              {
                const selected = accountState.entities.data?.find((a) => a.id.toString() === val);
                handleChange({ purchaseAccountId: selected?.id, purchaseAccountName: selected?.name });
              } }
              columnsNames={ AccountFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(ClientsAndSuppliersSlice.entityActions.filter(condition)) }
              disabled={ accountState.isLoading }
            />
          </div>
        </FieldsSection>
      </FieldGroup>
    </div>
  );
}
