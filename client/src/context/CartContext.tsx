import React, { createContext, useContext, useState } from "react";

type CartSheetContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openSheet: () => void;
  closeSheet: () => void;
};
const CartSheetContext = createContext<CartSheetContextType | undefined>(
  undefined
);

type CartSheetProviderProps = {
  children: React.ReactNode;
};

const CartSheetProvider: React.FC<CartSheetProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openSheet = () => setIsOpen(true);
  const closeSheet = () => setIsOpen(false);

  const value: CartSheetContextType = {
    isOpen,
    setIsOpen,
    openSheet,
    closeSheet,
  };

  return (
    <CartSheetContext.Provider value={value}>
      {children}
    </CartSheetContext.Provider>
  );
};

const useCart = (): CartSheetContextType => {
  const context = useContext(CartSheetContext);

  if (!context) {
    throw new Error("useCart must be used within a SheetProvider");
  }

  return context;
};

export { CartSheetProvider, useCart };
