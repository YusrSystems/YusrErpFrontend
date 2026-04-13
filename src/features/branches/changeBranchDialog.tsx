import { Branch, CityFilterColumns } from "@yusr_systems/core";
import { ChangeDialog, type CommonChangeDialogProps, FieldGroup, FieldsSection, FormField, SearchableSelect, TextField, useFormErrors, useFormInit, useValidate } from "@yusr_systems/ui";
import { useEffect } from "react";
import { BranchSlice, BranchValidationRules } from "../../core/data/branchLogic";
import { filterCities } from "../../core/state/shared/citySlice";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

export default function ChangeBranchDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<Branch>)
{
  const cityState = useAppSelector((state) => state.city);
  const dispatch = useAppDispatch();

  useEffect(() =>
  {
    dispatch(filterCities(undefined));
  }, [dispatch]);

  const { formData, errors } = useAppSelector((state) => state.branchForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const { validate } = useValidate(
    formData,
    BranchValidationRules.validationRules,
    (errors) => dispatch(BranchSlice.formActions.setErrors(errors))
  );
  useFormInit(BranchSlice.formActions.setInitialData, entity ?? {});

  return (
    <ChangeDialog<Branch>
      title={ `${mode === "create" ? "إضافة" : "تعديل"} فرع` }
      formData={ formData }
      dialogMode={ mode }
      service={ service }
      disable={ () => cityState.isLoading }
      onSuccess={ (data) => onSuccess?.(data, mode) }
      validate={ validate }
    >
      <FieldGroup className="py-2">
        <TextField
          label="اسم الفرع"
          value={ formData.name || "" }
          onChange={ (e) => dispatch(BranchSlice.formActions.updateFormData({ name: e.target.value })) }
          isInvalid={ isInvalid("name") }
          error={ getError("name") }
          required={ true }
        />

        <FormField label="المدينة" required={ true } isInvalid={ isInvalid("cityId") } error={ getError("cityId") }>
          <SearchableSelect
            items={ cityState.entities.data ?? [] }
            itemLabelKey="name"
            itemValueKey="id"
            placeholder="اختر المدينة"
            value={ formData.cityId?.toString() || "" }
            onValueChange={ (val) => dispatch(BranchSlice.formActions.updateFormData({ cityId: Number(val) })) }
            columnsNames={ CityFilterColumns.columnsNames }
            onSearch={ (condition) => dispatch(filterCities(condition)) }
            isInvalid={ isInvalid("cityId") }
            disabled={ cityState.isLoading }
          />
        </FormField>

        <FieldsSection title="الموقع" columns={ 2 }>
          <TextField
            label="الشارع"
            value={ formData.street || "" }
            onChange={ (e) => dispatch(BranchSlice.formActions.updateFormData({ street: e.target.value })) }
          />
          <TextField
            label="الحي"
            value={ formData.district || "" }
            onChange={ (e) => dispatch(BranchSlice.formActions.updateFormData({ district: e.target.value })) }
          />
          <TextField
            label="رقم المبنى"
            value={ formData.buildingNumber || "" }
            onChange={ (e) => dispatch(BranchSlice.formActions.updateFormData({ buildingNumber: e.target.value })) }
          />
          <TextField
            label="الرمز البريدي"
            value={ formData.postalCode || "" }
            onChange={ (e) => dispatch(BranchSlice.formActions.updateFormData({ postalCode: e.target.value })) }
          />
        </FieldsSection>
      </FieldGroup>
    </ChangeDialog>
  );
}
