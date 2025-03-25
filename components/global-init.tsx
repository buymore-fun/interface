"use client";

import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { initSdk } from "@/lib/raydium/config";

/**
 * GlobalInit component handles application-wide initialization
 * and global event listeners
 */
export function GlobalInit() {
  const { publicKey, connected } = useWallet();

  const initRaydium = async () => {
    if (publicKey) {
      await initSdk({ owner: publicKey });
    }
  };

  // Log wallet connection status changes
  useEffect(() => {
    if (connected && publicKey) {
      console.log("Wallet connected:", publicKey?.toString());
      initSdk({ owner: publicKey! });
    }
  }, [connected, publicKey]);

  return null; // This component doesn't render anything
}
