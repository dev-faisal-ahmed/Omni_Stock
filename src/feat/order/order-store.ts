import { toast } from "sonner";
import { create } from "zustand";

export interface TOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number; // Added to make validation easier in the Cart component
}

interface OrderStoreState {
  items: TOrderItem[];
  customerName: string;
  setCustomerName: (name: string) => void;
  addItem: (item: Omit<TOrderItem, "quantity" | "stock">, productStock: number) => void;
  updateQuantity: (productId: string, quantity: number, productStock: number) => void;
  removeItem: (productId: string) => void;
  removeAll: () => void;
}

export const useOrderStore = create<OrderStoreState>((set, get) => ({
  items: [],
  customerName: "",

  setCustomerName: (name) => set({ customerName: name }),

  addItem: (item, productStock) => {
    const { items } = get();
    const existingItemIndex = items.findIndex((i) => i.productId === item.productId);

    if (existingItemIndex == -1 && productStock >= 1) {
      return set({
        items: [...items, { ...item, quantity: 1, stock: productStock }],
      });
    }

    // Check if increasing quantity exceeds stock
    const existingItem = items[existingItemIndex];
    if (existingItem.quantity + 1 > productStock) {
      return toast.error("Stock limit reached for this product");
    }

    const newItems = [...items];
    newItems[existingItemIndex] = {
      ...existingItem,
      quantity: existingItem.quantity + 1,
    };

    set({ items: newItems });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },

  removeAll: () => {
    set({ items: [], customerName: "" });
  },

  updateQuantity: (productId, quantity) => {
    // Automatically remove item if less than or equal to 0
    if (quantity <= 0) {
      set((state) => ({
        items: state.items.filter((item) => item.productId !== productId),
      }));

      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    }));
  },
}));
