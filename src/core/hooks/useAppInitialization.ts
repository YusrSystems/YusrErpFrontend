import ApplicationLang from "@/app/core/services/langService/applicationLang";
import { Languages } from "@/app/core/services/langService/languages";
import { useEffect, useState } from "react";

export default function useAppInitialization()
{
  const [isLoading, setLoading] = useState(true);

  useEffect(() =>
  {
    const userLang = ApplicationLang.getUserLang();
    if (!userLang)
    {
      ApplicationLang.setUserLang(Languages.ar);
    }

    setLoading(false);
  }, []);

  return { isLoading };
}
