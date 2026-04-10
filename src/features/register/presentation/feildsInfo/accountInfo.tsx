import { PasswordField, TextField } from "@yusr_systems/ui";
import type Registration from "../../../../core/data/registration";
import { useAppDispatch, useAppSelector } from "../../../../core/state/store";
import { updateField } from "../../logic/registerSlice";

export default function AccountInfo()
{
  const { formData, errors } = useAppSelector((state) => state.register);
  const dispatch = useAppDispatch();
  function onFieldChange(field: Partial<Registration>)
  {
    dispatch(updateField(field));
  }
  return (
    <>
      <TextField
        label="البريد الإلكتروني للشركة"
        id="email"
        type="email"
        placeholder="company@example.com"
        value={ formData.email || "" }
        isInvalid={ !!errors.email }
        error={ errors.email }
        onChange={ (e) => onFieldChange({ email: e.target.value }) }
        required
      />

      <PasswordField
        label="كلمة مرور الشركة"
        id="password"
        placeholder="••••••••"
        value={ formData.password || "" }
        isInvalid={ !!errors.password }
        error={ errors.password }
        onChange={ (e) => onFieldChange({ password: e.target.value }) }
        required
      />

      <TextField
        label="اسم المستخدم"
        id="username"
        type="text"
        placeholder="أدخل اسم المستخدم"
        value={ formData.username || "" }
        isInvalid={ !!errors.username }
        error={ errors.username }
        onChange={ (e) => onFieldChange({ username: e.target.value }) }
        required
      />

      <PasswordField
        label="كلمة مرور المستخدم"
        id="userPassword"
        placeholder="••••••••"
        value={ formData.userPassword || "" }
        isInvalid={ !!errors.userPassword }
        error={ errors.userPassword }
        onChange={ (e) => onFieldChange({ userPassword: e.target.value }) }
        required
      />
      {
        /*
      <SelectField
        label="مندوب المبيعات (اختياري)"
        value={ formData.salesDelegateId?.toString() || "none" }
        isInvalid={ !!errors.salesDelegateId }
        error={ errors.salesDelegateId }
        onValueChange={ (val) => onFieldChange({ salesDelegateId: val === "none" ? undefined : Number(val) }) }
        options={ [
          { label: "بدون مندوب", value: "none" },
          ...salesDelegates.map((s) => ({ label: s.name, value: s.id.toString() }))
        ] }
      /> */
      }
    </>
  );
}
