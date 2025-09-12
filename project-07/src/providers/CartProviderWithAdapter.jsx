// Enhanced Cart Provider with Data Adapter Configuration
// ======================================================

import React, { createContext, useMemo } from "react";
import { CartProvider as BaseCartProvider } from "../context/CartContext.jsx";
import {
  CartDataAdapter,
  createPlatformAdapter,
  createAutoAdapter,
} from "../adapters/CartDataAdapter.js";

const CartConfigContext = createContext({});

/**
 * Enhanced CartProvider that supports data adapter configuration
 */
export function CartProviderWithAdapter({
  children,
  adapterConfig = {},
  platform = null,
  autoDetect = false,
  sampleData = null,
  ...cartProps
}) {
  const adapter = useMemo(() => {
    // Platform-specific adapter
    if (platform) {
      return createPlatformAdapter(platform);
    }

    // Auto-detection adapter
    if (autoDetect && sampleData) {
      return createAutoAdapter(sampleData);
    }

    // Custom field mapping
    if (Object.keys(adapterConfig).length > 0) {
      return new CartDataAdapter(adapterConfig);
    }

    // Default adapter
    return new CartDataAdapter();
  }, [platform, adapterConfig, autoDetect, sampleData]);

  const configValue = useMemo(
    () => ({
      adapter,
      platform,
      adapterConfig,
    }),
    [adapter, platform, adapterConfig]
  );

  return (
    <CartConfigContext.Provider value={configValue}>
      <BaseCartProvider {...cartProps}>{children}</BaseCartProvider>
    </CartConfigContext.Provider>
  );
}
