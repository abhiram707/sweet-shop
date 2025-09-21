import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Sweet } from '../types';

export interface CartItem {
  id: string;
  sweet: Sweet;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { sweet: Sweet; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { sweetId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { sweetId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

interface CartContextType extends CartState {
  addToCart: (sweet: Sweet, quantity?: number) => void;
  removeFromCart: (sweetId: string) => void;
  updateQuantity: (sweetId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { sweet, quantity } = action.payload;
      const existingItem = state.items.find(item => item.sweet.id === sweet.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.sweet.id === sweet.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, sweet.quantity) }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: updatedItems.reduce((sum, item) => sum + (item.sweet.price * item.quantity), 0),
        };
      } else {
        const newItem: CartItem = {
          id: sweet.id,
          sweet,
          quantity: Math.min(quantity, sweet.quantity),
        };
        
        const updatedItems = [...state.items, newItem];
        
        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: updatedItems.reduce((sum, item) => sum + (item.sweet.price * item.quantity), 0),
        };
      }
    }
    
    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.sweet.id !== action.payload.sweetId);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + (item.sweet.price * item.quantity), 0),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { sweetId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: { sweetId } });
      }
      
      const updatedItems = state.items.map(item =>
        item.sweet.id === sweetId
          ? { ...item, quantity: Math.min(quantity, item.sweet.quantity) }
          : item
      );
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + (item.sweet.price * item.quantity), 0),
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    
    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      };
    
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      };
    
    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (sweet: Sweet, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { sweet, quantity } });
  };

  const removeFromCart = (sweetId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { sweetId } });
  };

  const updateQuantity = (sweetId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { sweetId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
