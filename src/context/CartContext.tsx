import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product, ProductVariant } from '../types';

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; variant: ProductVariant; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: string; variantSize: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; variantSize: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] };

interface CartContextType {
  state: CartState;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (productId: string, variantSize: string) => void;
  updateQuantity: (productId: string, variantSize: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const calculateTotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (i) => i.product.id === action.product.id && i.variant.size === action.variant.size
      );
      let newItems: CartItem[];
      if (existingIndex >= 0) {
        newItems = state.items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + action.quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product: action.product, variant: action.variant, quantity: action.quantity }];
      }
      return { items: newItems, total: calculateTotal(newItems) };
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        (i) => !(i.product.id === action.productId && i.variant.size === action.variantSize)
      );
      return { items: newItems, total: calculateTotal(newItems) };
    }
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map((item) =>
        item.product.id === action.productId && item.variant.size === action.variantSize
          ? { ...item, quantity: action.quantity }
          : item
      );
      return { items: newItems, total: calculateTotal(newItems) };
    }
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    case 'LOAD_CART':
      return { items: action.items, total: calculateTotal(action.items) };
    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('vlo_cart');
    if (saved) {
      try {
        const items = JSON.parse(saved) as CartItem[];
        dispatch({ type: 'LOAD_CART', items });
      } catch {
        // Panier corrompu, on ignore
      }
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('vlo_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product: Product, variant: ProductVariant, quantity = 1) =>
    dispatch({ type: 'ADD_ITEM', product, variant, quantity });

  const removeItem = (productId: string, variantSize: string) =>
    dispatch({ type: 'REMOVE_ITEM', productId, variantSize });

  const updateQuantity = (productId: string, variantSize: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', productId, variantSize, quantity });

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans un CartProvider');
  return ctx;
};
