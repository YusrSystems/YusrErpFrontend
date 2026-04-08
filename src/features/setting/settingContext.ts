import type { DialogMode } from "@yusr_systems/ui";
import { createContext, useContext } from "react";
import type { Setting } from "../../core/data/setting";

export type SettingContextType = {
  mode: DialogMode;
  handleChange: (
    update: Partial<Setting> | ((prev: Partial<Setting>) => Partial<Setting>)
  ) => void;
  formData: Partial<Setting>;
  isInvalid: (field: string) => boolean;
  getError: (field: string) => string;
  clearError: (field: string) => void;
};
export const SettingContext = createContext<SettingContextType | undefined>(
  undefined
);

export function useSettingContext(): SettingContextType
{
  const settingContext = useContext(SettingContext);
  if (!settingContext)
  {
    throw new Error(
      "useSettingContext must be used within an SettingContext.Provider"
    );
  }
  return settingContext;
}
