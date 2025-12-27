/**
 * Thirdweb Provider Component
 * 
 * Wraps the application with Thirdweb's React provider for Web3 functionality.
 * Enables wallet connections, authentication, and blockchain interactions.
 */

"use client";

import { ThirdwebProvider as TWProvider } from "thirdweb/react";
import { ReactNode } from "react";

interface ThirdwebProviderProps {
  children: ReactNode;
}

export default function ThirdwebProvider({ children }: ThirdwebProviderProps) {
  return <TWProvider>{children}</TWProvider>;
}
