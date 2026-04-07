import { createContext, useContext } from "react";
import type Item from "../../core/data/item";
import type { StorageFile } from "@yusr_systems/core";
import type { DialogMode } from "@yusr_systems/ui";
export type ItemContextType = {
  mode: DialogMode;
  handleChange: (
    update: Partial<Item> | ((prev: Partial<Item>) => Partial<Item>),
  ) => void;
  formData: Partial<Item>;
  isInvalid: (field: string) => boolean;
  getError: (field: string) => string;
  clearError: (field: string) => void;

  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => Promise<void>;
  handleRemoveFile: (index: number) => void;
  handleDownload: (
    e: React.MouseEvent,
    file: StorageFile | undefined,
  ) => Promise<void>;
  showFilePreview: (file: StorageFile | undefined) => boolean;
  getFileSrc: (file: StorageFile | undefined) => string;
};
export const ItemContext = createContext<ItemContextType | undefined>(
  undefined,
);

export function useItemContext(): ItemContextType {
  const itemContext = useContext(ItemContext);
  if (!itemContext) {
    throw new Error(
      "useItemContext must be used within an ItemContext.Provider",
    );
  }
  return itemContext;
}
