import AppText from "./app_text.json";
import { LanguageConstants } from "./languageConstants";
import type { Languages } from "./languages";

export default class ApplicationLanguages
{
  static setUserLanguage(lang: Languages)
  {
    localStorage.setItem(LanguageConstants.langKey, lang);
  }
  static getUserLanguage()
  {
    return localStorage.getItem(LanguageConstants.langKey);
  }
  static getAppLanguageText()
  {
    const userLang: string = this.getUserLanguage() || "ar";
    return AppText[userLang as keyof typeof AppText];
  }
}
