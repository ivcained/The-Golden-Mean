/**
 * Main Application Component
 * 
 * This is the root client component that initializes the MiniApp and
 * handles authentication. It wraps the SoberTimer component and manages
 * the Farcaster MiniKit integration.
 * 
 * Features:
 * - Initializes Farcaster MiniKit frame
 * - Handles Quick Auth for user verification
 * - Provides user context (FID) to child components
 * - Dynamically loads SoberTimer (client-side only)
 */

"use client";

import dynamic from "next/dynamic";
import { useMiniKit, useQuickAuth } from "@coinbase/onchainkit/minikit";
import { useEffect } from "react";

/**
 * Dynamically import SoberTimer component
 * Disabled SSR to ensure it only renders on client (required for localStorage access)
 */
const SoberTimer = dynamic(() => import("~/components/SoberTimer"), {
  ssr: false,
});

/**
 * Response interface for authentication API
 */
interface AuthResponse {
  /** Whether authentication was successful */
  success: boolean;
  /** User information if authenticated */
  user?: {
    /** Farcaster ID - unique identifier for the user */
    fid: number;
    /** Unix timestamp when token was issued */
    issuedAt?: number;
    /** Unix timestamp when token expires */
    expiresAt?: number;
  };
  /** Error message if authentication failed */
  message?: string;
}

/**
 * Main App Component
 * 
 * Initializes the Farcaster MiniApp environment and renders the main
 * SoberTimer component. Handles frame readiness and optional authentication.
 * 
 * @returns The main application UI
 */
export default function App() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();

  /**
   * Effect: Initialize the MiniApp frame
   * 
   * Signals to Farcaster that the app is ready to be displayed.
   * This should be called once the app has finished loading.
   */
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  /**
   * Optional: Verify user identity with Quick Auth
   * 
   * Quick Auth provides server-side verification of the user's identity.
   * This is useful if you need cryptographic proof of the user's FID.
   * 
   * Note: If you don't need verification, you can access user data directly
   * via `context.user.fid` without making an API call.
   * 
   * See /app/api/auth/route.ts for the verification implementation.
   */
  const {
    data: authData,
    isLoading: isAuthLoading,
    error: authError,
  } = useQuickAuth<AuthResponse>("/api/auth", { method: "GET" });

  return <SoberTimer />;
}
