/**
 * Application Providers Wrapper
 * 
 * This component wraps the entire application with necessary context providers
 * for Web3, Farcaster MiniKit, and other features.
 * 
 * Provider Stack (outer to inner):
 * 1. ThirdwebProvider - Web3 wallet and authentication
 * 2. WagmiProvider - Ethereum interactions and wallet management
 * 3. MiniKitProvider - Farcaster MiniApp SDK integration
 */

"use client";

import Provider from "../components/providers/WagmiProvider";
import ThirdwebProvider from "../components/providers/ThirdwebProvider";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { ReactNode } from "react";

/**
 * Providers Component
 * 
 * Combines all necessary context providers for the application.
 * All children will have access to Web3, Wagmi, and MiniKit contexts.
 * 
 * @param children - Child components to wrap with providers
 * @returns Wrapped component tree with all providers
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThirdwebProvider>
      <Provider>
        <MiniKitProvider
          enabled={true}
          notificationProxyUrl="/api/notify"
          autoConnect={true}
        >
          {children}
        </MiniKitProvider>
      </Provider>
    </ThirdwebProvider>
  );
}
