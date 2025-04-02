"use client";

import { useCallback, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { connection, initSdk } from "@/lib/raydium/config";
import { useSolBalance } from "@/hooks/use-sol-balance";
import { useRaydium } from "@/hooks/use-raydium";
import { useSolPrice } from "@/hooks/use-sol-price";
/**
 * GlobalInit component handles application-wide initialization
 * and global event listeners
 */
export function GlobalInit() {
  const { publicKey, connected } = useWallet();
  const { initializeSdk } = useRaydium();
  const { fetchSolBalance } = useSolBalance();
  const { fetchSolPrice } = useSolPrice();

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

  useEffect(() => {
    fetchSolPrice();

    // Refresh price every 5 minutes
    const intervalId = setInterval(fetchSolPrice, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [fetchSolPrice]);

  return null; // This component doesn't render anything
}
