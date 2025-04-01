"use client";

import { useCallback, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { connection, initSdk } from "@/lib/raydium/config";
import { useSolBalance } from "@/hooks/use-sol-balance";
import { useRaydium } from "@/hooks/use-raydium";
/**
 * GlobalInit component handles application-wide initialization
 * and global event listeners
 */
export function GlobalInit() {
  const { publicKey, connected } = useWallet();
  const { initializeSdk } = useRaydium();

  // const initRaydium = useCallback(async () => {
  //   if (publicKey) {
  //     await initSdk({ owner: publicKey });
  //   }
  // }, [publicKey]);

  // Log wallet connection status changes
  useEffect(() => {
    if (connected && publicKey) {
      console.log("Wallet connected:", publicKey?.toString());
      initSdk({ owner: publicKey! });
    }
  }, [connected, publicKey]);

  const { fetchSolBalance } = useSolBalance();

  useEffect(() => {
    fetchSolBalance();

    // Set up listener for balance changes
    if (publicKey) {
      const id = connection.onAccountChange(publicKey, () => {
        fetchSolBalance();
      });

      return () => {
        connection.removeAccountChangeListener(id);
      };
    }
  }, [publicKey, fetchSolBalance]);

  return null; // This component doesn't render anything
}
