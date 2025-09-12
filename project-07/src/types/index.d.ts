// TypeScript definitions for React Cart Library
// ==============================================================================

import React from "react";

// Base Types
export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  category?: string;
  metadata?: Record<string, any>;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
}

export interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  getItem: (id: string | number) => CartItem | undefined;
  hasItem: (id: string | number) => boolean;
  bulkAddItems: (items: CartItem[]) => void;
  bulkRemoveItems: (ids: (string | number)[]) => void;
}

// Component Props
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "small" | "medium" | "large";
}

export interface CartProps {
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  emptyMessage?: string;
  maxHeight?: string | number;
  onItemClick?: (item: CartItem) => void;
  onCheckout?: (items: CartItem[]) => void;
  allowClear?: boolean;
}

export interface CartItemProps {
  item: CartItem;
  onQuantityChange?: (id: string | number, quantity: number) => void;
  onRemove?: (id: string | number) => void;
  showImage?: boolean;
  showDescription?: boolean;
  allowQuantityEdit?: boolean;
  className?: string;
}

export interface AddToCartProps {
  item: Omit<CartItem, "quantity">;
  quantity?: number;
  onAdd?: (item: CartItem) => void;
  disabled?: boolean;
  showQuantitySelector?: boolean;
  maxQuantity?: number;
  className?: string;
  children?: React.ReactNode;
}

// Hook Types
export interface UseCartOperationsReturn {
  addItem: CartContextType["addItem"];
  removeItem: CartContextType["removeItem"];
  updateQuantity: CartContextType["updateQuantity"];
  clearCart: CartContextType["clearCart"];
  bulkAddItems: CartContextType["bulkAddItems"];
  bulkRemoveItems: CartContextType["bulkRemoveItems"];
}

export interface UseCartValidationReturn {
  validateItem: (item: Partial<CartItem>) => string[];
  validateQuantity: (quantity: number, maxQuantity?: number) => string[];
  isValidItem: (item: Partial<CartItem>) => boolean;
  isValidQuantity: (quantity: number, maxQuantity?: number) => boolean;
}

export interface UseCartStorageReturn {
  saveCart: (cart: CartState) => void;
  loadCart: () => CartState | null;
  clearStorage: () => void;
  isStorageAvailable: boolean;
}

// Component Declarations
export declare const Cart: React.FC<CartProps>;
export declare const CartItem: React.FC<CartItemProps>;
export declare const AddToCart: React.FC<AddToCartProps>;
export declare const Button: React.FC<ButtonProps>;
export declare const Input: React.FC<InputProps>;
export declare const Modal: React.FC<ModalProps>;
export declare const Card: React.FC<CardProps>;

// Context & Hooks
export declare const CartProvider: React.FC<{ children: React.ReactNode }>;
export declare const useCart: () => CartContextType;
export declare const useCartOperations: () => UseCartOperationsReturn;
export declare const useCartValidation: () => UseCartValidationReturn;
export declare const useCartStorage: () => UseCartStorageReturn;

// Constants
export declare const VERSION: string;
export declare const LIBRARY_NAME: string;

// Default Export
declare const ReactCartLibrary: {
  Cart: typeof Cart;
  CartItem: typeof CartItem;
  AddToCart: typeof AddToCart;
  Button: typeof Button;
  Input: typeof Input;
  Modal: typeof Modal;
  Card: typeof Card;
  CartProvider: typeof CartProvider;
  useCart: typeof useCart;
  useCartOperations: typeof useCartOperations;
  useCartValidation: typeof useCartValidation;
  useCartStorage: typeof useCartStorage;
  VERSION: typeof VERSION;
  LIBRARY_NAME: typeof LIBRARY_NAME;
};

export default ReactCartLibrary;
