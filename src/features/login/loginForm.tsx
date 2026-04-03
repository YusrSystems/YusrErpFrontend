import { LoginRequest } from "@/app/core/data/loginRequest";
import type { Setting } from "@/app/core/data/setting";
import { login, updateLoggedInUser, useAppDispatch } from "@/app/core/state/store";
import placeholderImg from "@/assets/placeholder.svg";
import { ApiConstants, SystemPermissions, type ValidationRule, Validators, YusrApiHelper } from "@yusr_systems/core";
import { Button, Card, CardContent, Checkbox, cn, Field, FieldDescription, FieldGroup, PasswordField, TextField, useEntityForm } from "@yusr_systems/ui";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type User from "../users/data/user";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">)
{
  const navigate = useNavigate();
  const validationRules: ValidationRule<Partial<LoginRequest>>[] = useMemo(
    () => [{
      field: "email",
      selector: (d) => d.companyEmail,
      validators: [Validators.required("البريد الإلكتروني مطلوب")]
    }, {
      field: "username",
      selector: (d) => d.username,
      validators: [Validators.required("اسم المستخدم مطلوب")]
    }, { field: "password", selector: (d) => d.password, validators: [Validators.required("كلمة المرور مطلوبة")] }],
    []
  );
  const INITIAL_STATE = useMemo(() => ({}), []);
  const { formData, handleChange, getError, isInvalid, validate, clearError } = useEntityForm<LoginRequest>(
    INITIAL_STATE,
    validationRules
  );
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();

  const emailStorageItemName = "remembered_email";
  const usernameStorageItemName = "remembered_username";

  useEffect(() =>
  {
    const savedEmail = localStorage.getItem(emailStorageItemName);
    const savedUsername = localStorage.getItem(usernameStorageItemName);
    if (savedEmail || savedUsername)
    {
      handleChange((prev) => ({ ...prev, companyEmail: savedEmail || "", username: savedUsername || "" }));
      setRememberMe(true);
    }
  }, []);

  const Login = async () =>
  {
    if (!validate())
    {
      return;
    }

    if (rememberMe)
    {
      localStorage.setItem(emailStorageItemName, formData.companyEmail || "");
      localStorage.setItem(usernameStorageItemName, formData.username || "");
    }
    else
    {
      localStorage.removeItem(emailStorageItemName);
      localStorage.removeItem(usernameStorageItemName);
    }

    const request = new LoginRequest({
      companyEmail: formData.companyEmail,
      username: formData.username,
      password: formData.password
    });

    setLoading(true);

    const result = await YusrApiHelper.Post<{ user: User; setting: Setting; }>(
      `${ApiConstants.baseUrl}/Login`,
      request
    );

    if (result.status === 200 && result.data)
    {
      dispatch(login(result.data));
      dispatch(updateLoggedInUser(result.data.user));

      const origin = location.state?.from?.pathname
        || SystemPermissions.getFirstPermissionPath(result.data.user.role.permissions || []);

      setLoading(false);

      setTimeout(() =>
      {
        navigate(origin, { replace: true });
      }, 10);
    }
    else
    {
      setLoading(false);
    }
  };

  return (
    <div className={ cn("flex flex-col gap-6", className) } { ...props }>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">أهلا بك مجددًا</h1>
                <p className="text-muted-foreground text-balance">سجل الدخول إلى حسابك</p>
              </div>

              <TextField
                label="البريد الإلكتروني"
                id="email"
                type="email"
                placeholder="m@example.com"
                value={ formData.companyEmail || "" }
                isInvalid={ isInvalid("email") }
                error={ getError("email") }
                onChange={ (e) =>
                {
                  handleChange({ companyEmail: e.target.value });
                  clearError("email");
                } }
                required
              />

              <TextField
                label="اسم المستخدم"
                id="username"
                type="text"
                placeholder="أدخل اسم المستخدم"
                value={ formData.username || "" }
                isInvalid={ isInvalid("username") }
                error={ getError("username") }
                onChange={ (e) =>
                {
                  handleChange({ username: e.target.value });
                  clearError("username");
                } }
                required
              />

              <PasswordField
                label="كلمة المرور"
                id="password"
                placeholder="••••••••"
                value={ formData.password || "" }
                isInvalid={ isInvalid("password") }
                error={ getError("password") }
                onChange={ (e) =>
                {
                  handleChange({ password: e.target.value });
                  clearError("password");
                } }
                required
              />

              <div className="flex items-center gap-3">
                <Checkbox
                  id="rememberMe"
                  checked={ rememberMe }
                  onCheckedChange={ (checked) => setRememberMe(checked as boolean) }
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  تذكرني
                </label>
              </div>

              <Field>
                <Button type="button" disabled={ loading } onClick={ Login }>
                  { loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" /> }
                  تسجيل الدخول
                </Button>
              </Field>
              <FieldDescription className="text-center">
                لا تملك حسابًا بعد؟ <a href="#">سجل معنا</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={ placeholderImg }
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
