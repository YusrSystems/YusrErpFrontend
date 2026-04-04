import { useEffect, useState } from "react";
import ApplicationLanguages from "../services/language/applicationLanguages";
import { Languages } from "../services/language/languages";

export default function useAppInitialization()
{
  const [isLoading, setLoading] = useState(true);

  useEffect(() =>
  {
    const userLang = ApplicationLanguages.getUserLanguage();
    if (!userLang)
    {
      ApplicationLanguages.setUserLanguage(Languages.ar);
    }

    setLoading(false);
  }, []);

  return { isLoading };
}
