/**
 * Frame Provider Component
 * 
 * Provides Farcaster MiniApp context to child components.
 * Wraps the MiniKit hooks to make frame context available throughout
 * the component tree.
 * 
 * Provides:
 * - Frame context (user info, capabilities, etc.)
 * - MiniApp detection
 * - Context sharing via React Context
 */

'use client'

import { useMiniKit, useIsInMiniApp } from '@coinbase/onchainkit/minikit';
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface MiniAppClient {
  platformType?: 'web' | 'mobile';
  clientFid: number;
  added: boolean;
  safeAreaInsets?: SafeAreaInsets;
  notificationDetails?: {
    url: string;
    token: string;
  };
}

interface MiniAppContext {
  user: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
  location?: Record<string, unknown>;
  client: MiniAppClient;
}

type FrameContextType = {
  context: MiniAppContext | Record<string, unknown> | null;
  isInMiniApp: boolean;
} | null;

const FrameContext = createContext<FrameContextType>(null);

export const useFrameContext = () => useContext(FrameContext);

export default function FrameProvider({ children }: { children: ReactNode }){
  const [frameContext, setFrameContext] = useState<FrameContextType>(null);
  const { context } = useMiniKit();
  const { isInMiniApp } = useIsInMiniApp();

  useEffect(() => {
    const init = async () => {
      try {
        // Small delay to ensure context is fully loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setFrameContext({ 
          context: context, 
          isInMiniApp: isInMiniApp ?? false 
        });
        
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setFrameContext({ 
          context: { error: 'Failed to initialize' }, 
          isInMiniApp: false 
        });
      }
    }
    
    init();
  }, [context, isInMiniApp])

  return(
    <FrameContext.Provider value={frameContext}>
      {children}
    </FrameContext.Provider>
  );
}