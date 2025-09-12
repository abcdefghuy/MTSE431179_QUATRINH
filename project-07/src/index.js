// React Cart Library - Main Entry Point
// ==============================================================================
// Professional library exports for enterprise use
// Compatible with ES modules, CommonJS, and TypeScript

// Core Cart Components
import Cart from "./components/Cart/Cart.jsx";
import CartItem from "./components/Cart/CartItem.jsx";
import AddToCart from "./components/Cart/AddToCart.jsx";

// Standardized UI Components
import Button from "./components/UI/Button.jsx";
import Input from "./components/UI/Input.jsx";
import Modal from "./components/UI/Modal.jsx";
import Card from "./components/UI/Card.jsx";

// State Management
import { CartProvider, useCart } from "./context/CartContext.jsx";

// Enhanced Provider with Adapters
import { CartProviderWithAdapter } from "./providers/CartProviderWithAdapter.jsx";

// Standard Hooks
import useCartOperations from "./hooks/useCartOperations.js";
import useCartValidation from "./hooks/useCartValidation.js";
import useCartStorage from "./hooks/useCartStorage.js";

// Data Adapter Hooks
import {
  useCartAdapter,
  useAutoAdapter,
  useCartAPI,
  useCartForm,
  useCartBulk,
} from "./hooks/useCartAdapter.js";

// Data Adapters
import {
  CartDataAdapter,
  createPlatformAdapter,
  createAutoAdapter,
  PLATFORM_MAPPINGS,
} from "./adapters/CartDataAdapter.js";

// Configuration
import { CART_CONFIG_PRESETS } from "./config/cartPresets.js";

// Re-export all components and hooks
export {
  // Cart Components
  Cart,
  CartItem,
  AddToCart,

  // UI Components
  Button,
  Input,
  Modal,
  Card,

  // Context & Providers
  CartProvider,
  CartProviderWithAdapter,
  useCart,

  // Standard Hooks
  useCartOperations,
  useCartValidation,
  useCartStorage,

  // Adapter Hooks
  useCartAdapter,
  useAutoAdapter,
  useCartAPI,
  useCartForm,
  useCartBulk,

  // Data Adapters
  CartDataAdapter,
  createPlatformAdapter,
  createAutoAdapter,
  PLATFORM_MAPPINGS,

  // Configuration
  CART_CONFIG_PRESETS,
};

// Library metadata
export const VERSION = "1.0.0";
export const LIBRARY_NAME = "@yourorg/react-cart-library";

// Convenience default export for quick setup
const ReactCartLibrary = {
  // Components
  Cart,
  CartItem,
  AddToCart,
  Button,
  Input,
  Modal,
  Card,

  // Context & Providers
  CartProvider,
  CartProviderWithAdapter,
  useCart,

  // Standard Hooks
  useCartOperations,
  useCartValidation,
  useCartStorage,

  // Adapter Hooks
  useCartAdapter,
  useAutoAdapter,
  useCartAPI,
  useCartForm,
  useCartBulk,

  // Data Adapters
  CartDataAdapter,
  createPlatformAdapter,
  createAutoAdapter,
  PLATFORM_MAPPINGS,

  // Configuration
  CART_CONFIG_PRESETS,

  // Meta
  VERSION,
  LIBRARY_NAME,
};

export default ReactCartLibrary;
