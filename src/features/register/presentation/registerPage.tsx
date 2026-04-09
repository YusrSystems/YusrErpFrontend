import { YusrBusBackground } from "@yusr_systems/ui";
import { useNavigate } from "react-router-dom";
import type Registration from "../../../core/data/registration";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";
import { nextStep, prevStep, registerAsync, resetForm } from "../logic/registerSlice";
import { RegisterForm } from "./registerForm";

export default function RegisterPage()
{
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { formData } = useAppSelector((state) => state.register);

  const handleSubmit = async () =>
  {
    await dispatch(registerAsync(formData as Registration));
    dispatch(resetForm());
    navigate("/login");
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <YusrBusBackground />
      <div className="w-full max-w-sm md:max-w-4xl">
        <RegisterForm
          onNextStep={ () => dispatch(nextStep()) }
          onPrevStep={ () => dispatch(prevStep()) }
          onSubmit={ handleSubmit }
          onLoginClick={ () => navigate("/login") }
        />
      </div>
    </div>
  );
}
