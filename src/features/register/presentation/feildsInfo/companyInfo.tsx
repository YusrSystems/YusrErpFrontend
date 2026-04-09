import { SelectField, TextField } from "@yusr_systems/ui";
import { useEffect } from "react";
import type Registration from "../../../../core/data/registration";
import { useAppDispatch, useAppSelector } from "../../../../core/state/store";
import { fetchCurrenciesAsync, updateField } from "../../logic/registerSlice";

export default function CompanyInfo()
{
  const dispatch = useAppDispatch();
  const { formData, errors, currencies } = useAppSelector((state) => state.register);
  useEffect(() =>
  {
    dispatch(fetchCurrenciesAsync());
  }, []);
  function onFieldChange(field: Partial<Registration>)
  {
    dispatch(updateField(field));
  }
  return (
    <>
      <TextField
        label="اسم الشركة"
        id="companyName"
        type="text"
        placeholder="أدخل اسم الشركة"
        value={ formData.companyName || "" }
        isInvalid={ !!errors.companyName }
        error={ errors.companyName }
        onChange={ (e) =>
        {
          dispatch(updateField({ companyName: e.target.value }));
        } }
        required
      />
      <TextField
        label="اسم الفرع"
        id="branchName"
        type="text"
        placeholder="أدخل اسم الفرع"
        value={ formData.branchName || "" }
        isInvalid={ !!errors.branchName }
        error={ errors.branchName }
        onChange={ (e) => onFieldChange({ branchName: e.target.value }) }
        required
      />
      <TextField
        label="نشاط الشركة التجاري"
        id="companyBusinessCategory"
        type="text"
        placeholder="مثال: تجزئة، مطاعم، تقنية..."
        value={ formData.companyBusinessCategory || "" }
        isInvalid={ !!errors.companyBusinessCategory }
        error={ errors.companyBusinessCategory }
        onChange={ (e) => onFieldChange({ companyBusinessCategory: e.target.value }) }
        required
      />
      <TextField
        label="رقم هاتف الشركة"
        id="companyPhone"
        type="tel"
        placeholder="05xxxxxxxx"
        value={ formData.companyPhone || "" }
        isInvalid={ !!errors.companyPhone }
        error={ errors.companyPhone }
        onChange={ (e) => onFieldChange({ companyPhone: e.target.value }) }
        required
      />
      <TextField
        label="السجل التجاري (CRN)"
        id="crn"
        type="text"
        placeholder="أدخل رقم السجل التجاري"
        value={ formData.crn || "" }
        isInvalid={ !!errors.crn }
        error={ errors.crn }
        onChange={ (e) => onFieldChange({ crn: e.target.value }) }
        required
      />
      <TextField
        label="الرقم الضريبي (VAT)"
        id="vatNumber"
        type="text"
        placeholder="أدخل الرقم الضريبي"
        value={ formData.vatNumber || "" }
        isInvalid={ !!errors.vatNumber }
        error={ errors.vatNumber }
        onChange={ (e) => onFieldChange({ vatNumber: e.target.value }) }
        required
      />
      { currencies
        && (
          <SelectField
            label="العملة"
            value={ formData.currencyId?.toString() ?? "" }
            isInvalid={ !!errors.currencyId }
            error={ errors.currencyId }
            onValueChange={ (val) => onFieldChange({ currencyId: Number(val) }) }
            required
            options={ currencies.map((c) => ({ label: c.name, value: c.id.toString() })) }
          />
        ) }
    </>
  );
}
