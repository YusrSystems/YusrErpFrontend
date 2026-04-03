import { YusrBusBackground } from "@yusr_systems/ui";
import { LoginForm } from "./loginForm";

export default function LoginPage()
{
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <YusrBusBackground />
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}
