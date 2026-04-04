import { toast } from "sonner";
import { create } from "zustand";

export interface TOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderStoreState {
  items: TOrderItem[];
  addItem: (item: Omit<TOrderItem, "quantity">, productStock: number) => void;
  updateQuantity: (productId: string, quantity: number, productStock: number) => void;
  removeItem: (productId: string) => void;
  removeAll: () => void;
}

export const useOrderStore = create<OrderStoreState>((set, get) => ({
  items: [],

  addItem: (item, productStock) => {
    const { items } = get();
    // const existingItem = items.find((i) => i.productId === item.productId);
    const existingItemIndex = items.findIndex((i) => i.productId === item.productId);

    if (existingItemIndex == -1 && productStock >= 1) {
      return set({
        items: [...items, { ...item, quantity: 1 }],
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
    set({ items: [] });
  },

  updateQuantity: (productId, quantity, productStock) => {
    if (quantity > productStock) return toast.error("Stock limit reached for this product");

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
