"use client";

import { StaticImageData } from "next/image";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface CartItem {
  name: string;
  image: StaticImageData;
  description: string;
  preco: string;
  quantity: number;
}

interface StockItem {
  name: string;
  stock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemName: string) => void; // Adicionar esta função
  updateStock: (productName: string, newStock: number) => void;
  stockItems: StockItem[];
  updateGoogleSheetStock: (
    productName: string,
    newStock: number
  ) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cartItems");
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  const [stockItems, setStockItems] = useState<StockItem[]>(() => {
    if (typeof window !== "undefined") {
      const storedStock = localStorage.getItem("stockItems");
      return storedStock ? JSON.parse(storedStock) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("stockItems", JSON.stringify(stockItems));
  }, [stockItems]);

  const updateGoogleSheetStock = async (
    productName: string,
    newStock: number
  ) => {
    try {
      const response = await fetch("/api/updateStock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, newStock }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar o estoque no Google Sheets");
      }
    } catch (error) {
      console.error("Erro ao atualizar o estoque:", error);
    }
  };

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.name === item.name);
      if (existingItem) {
        return prevItems.map((i) =>
          i.name === item.name
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prevItems, item];
    });
  };

  const removeFromCart = (itemName: string) => {
    const item = cartItems.find((cartItem) => cartItem.name === itemName);
    if (item) {
      const stockItem = stockItems.find((stock) => stock.name === itemName);
      if (stockItem) {
        updateStock(itemName, (stockItem.stock));
      }
    }
    setCartItems((prevCart) =>
      prevCart.filter((item) => item.name !== itemName)
    );
  };

  const updateStock = (productName: string, newStock: number) => {
    setStockItems((prevStock) =>
      prevStock.map((stock) =>
        stock.name === productName ? { ...stock, stock: newStock } : stock
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        updateStock,
        stockItems,
        updateGoogleSheetStock,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
