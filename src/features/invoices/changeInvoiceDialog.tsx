import { type ValidationRule, Validators } from "@yusr_systems/core";
import type { CommonChangeDialogProps } from "@yusr_systems/ui";
import { ChangeDialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Loading, useEntityForm } from "@yusr_systems/ui";
import { useEffect, useMemo, useState } from "react";
import type Invoice from "../../core/data/invoice";
import { InvoiceStatus, InvoiceType } from "../../core/data/invoice";
import { useAppDispatch } from "../../core/state/store";
import InvoiceBasicInfo from "./invoiceBasicInfo";
import { InvoiceContext } from "./invoiceContext";
import { ClientsAndSuppliersSlice } from "../../core/data/account";
import { filterStores } from "../stores/logic/storeSlice";

export default function ChangeInvoiceDialog({
  entity,
  mode,
  service,
  onSuccess
}: CommonChangeDialogProps<Invoice>)
{
  const [initLoading, setInitLoading] = useState(false);
  const dispatch = useAppDispatch();

  const validationRules: ValidationRule<Partial<Invoice>>[] = useMemo(
    () => [{
      field: "type",
      selector: (d) => d.type,
      validators: [Validators.required("يرجى اختيار نوع الفاتورة")]
    }, {
      field: "date",
      selector: (d) => d.date,
      validators: [Validators.required("يرجى إدخال تاريخ الفاتورة")]
    }, {
      field: "storeId",
      selector: (d) => d.storeId,
      validators: [Validators.required("يرجى تحديد المستودع")]
    }, {
      field: "actionAccountId",
      selector: (d) => d.actionAccountId,
      validators: [Validators.required("يرجى تحديد الحساب")]
    }],
    []
  );

  const initialValues = useMemo(
    () => ({
      ...entity,
      type: entity?.type ?? InvoiceType.Sell,
      statusId: entity?.statusId ?? InvoiceStatus.Valid,
      date: entity?.date
        ? new Date(entity.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      discountAmount: entity?.discountAmount ?? 0,
      addedAmount: entity?.addedAmount ?? 0,
      paidAmount: entity?.paidAmount ?? 0,
      fullAmount: entity?.fullAmount ?? 0
    }),
    [entity]
  );

  const { formData, handleChange, getError, clearError, isInvalid, validate } = useEntityForm<Invoice>(
    initialValues,
    validationRules
  );

  useEffect(() =>
  {
    dispatch(ClientsAndSuppliersSlice.entityActions.filter());
    dispatch(filterStores());
  }, [dispatch]);

  useEffect(() =>
  {
    if (mode === "update" && entity?.id)
    {
      setInitLoading(true);

      const getItem = async () =>
      {
        const res = await service.Get(entity.id);
        handleChange({ ...res.data });
        setInitLoading(false);
      };

      getItem();
    }
  }, [entity?.id, mode]);

  if (initLoading)
  {
    return (
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>
            { mode === "create" ? "إضافة" : "تعديل" } الفاتورة
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Loading entityName="الفاتورة" />
      </DialogContent>
    );
  }

  return (
    <InvoiceContext.Provider
      value={ {
        mode,
        formData,
        handleChange,
        isInvalid,
        getError,
        clearError
      } }
    >
      <ChangeDialog<Invoice>
        title={ `${mode === "create" ? "إنشاء" : "تعديل"} فاتورة` }
        className="sm:max-w-[90vw]"
        dialogMode={ mode }
        formData={ formData }
        service={ service }
        disable={ () => false }
        onSuccess={ (data) => onSuccess?.(data, mode) }
        validate={ validate }
      >
        <div className="flex flex-col gap-6">
          <InvoiceBasicInfo />

          {
            /* <FieldsSection title="التفاصيل المالية" columns={ 3 }>
            <NumberField
              label="مبلغ الخصم"
              value={ formData.discountAmount || 0 }
              onChange={ (e) => handleChange({ discountAmount: Number(e) }) }
            />
            <NumberField
              label="المبلغ المضاف"
              value={ formData.addedAmount || 0 }
              onChange={ (e) => handleChange({ addedAmount: Number(e) }) }
            />
            <NumberField
              label="المبلغ المدفوع"
              value={ formData.paidAmount || 0 }
              onChange={ (e) => handleChange({ paidAmount: Number(e) }) }
            />
          </FieldsSection>

          <FieldsSection title="معلومات إضافية" columns={ 2 }>
            <TextField
              label="المندوب"
              value={ formData.delegateEmp || "" }
              onChange={ (e) => handleChange({ delegateEmp: e.target.value }) }
            />

            <SelectField
              label="نوع الاستيراد / التصدير"
              value={ formData.importExportType?.toString() || "" }
              onValueChange={ (val) =>
                handleChange({
                  importExportType: Number(val) as ImportExportType
                }) }
              options={ [{ label: "محلي", value: ImportExportType.Local.toString() }, {
                label: "تصدير",
                value: ImportExportType.Export.toString()
              }, {
                label: "استيراد (آلية الاحتساب العكسي)",
                value: ImportExportType.ImportAccordingToTheReverseChargeMechanism.toString()
              }, {
                label: "استيراد (مدفوع للجمارك)",
                value: ImportExportType.ImportPaidForCustoms.toString()
              }] }
            />

            <div className="col-span-2">
              <TextField
                label="السياسة / الشروط"
                value={ formData.policy || "" }
                onChange={ (e) => handleChange({ policy: e.target.value }) }
              />
            </div>

            <div className="col-span-2">
              <TextAreaField
                label="ملاحظات"
                value={ formData.notes || "" }
                onChange={ (e) => handleChange({ notes: e.target.value }) }
                rows={ 3 }
              />
            </div>
          </FieldsSection> */
          }
        </div>
      </ChangeDialog>
    </InvoiceContext.Provider>
  );
}
