import { createContext, useContext } from "react";
import type Item from "../../core/data/item";
export type ItemContextType = {
  handleChange: (
    update: Partial<Item> | ((prev: Partial<Item>) => Partial<Item>),
  ) => void;
  formData: Partial<Item>;
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
