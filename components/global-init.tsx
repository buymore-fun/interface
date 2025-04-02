"use client";

import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { connection, initSdk } from "@/lib/raydium/config";
import { useSolBalance } from "@/hooks/use-sol-balance";
import { useRaydium } from "@/hooks/use-raydium";
import { useSolPrice } from "@/hooks/use-sol-price";
import { Raydium } from "@raydium-io/raydium-sdk-v2";

// Global state for Raydium instance
let globalRaydiumInstance: Raydium | null = null;
let globalIsInitialized = false;

/**
 * GlobalInit component handles application-wide initialization
 * and global event listeners
 */
export function GlobalInit() {
  const { publicKey, connected } = useWallet();
  const { setRaydiumInstance } = useRaydium();
  const { fetchSolBalance } = useSolBalance();
  const { fetchSolPrice } = useSolPrice();
  const [isInitialized, setIsInitialized] = useState(globalIsInitialized);

  // Initialize Raydium SDK
  const initializeSdkCallback = useCallback(async () => {
    if (!connected || !publicKey || isInitialized || globalRaydiumInstance) return;

    try {
      console.log("Initializing Raydium SDK...");
      const instance = await initSdk({ owner: publicKey });
      globalRaydiumInstance = instance;
      globalIsInitialized = true;
      setIsInitialized(true);
      setRaydiumInstance(instance);
      console.log("Raydium SDK initialized successfully");
    } catch (err) {
      console.error("Error initializing Raydium SDK:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, publicKey, isInitialized]);

  // Initialize SDK when wallet is connected
  useEffect(() => {
    initializeSdkCallback();
  }, [initializeSdkCallback]);

  // Log wallet connection status changes
  useEffect(() => {
    if (connected && publicKey) {
      console.log("Wallet connected:", publicKey?.toString());
      // initSdk({ owner: publicKey! });
    }
  }, [connected, publicKey]);

  useEffect(() => {
    fetchSolBalance();

    // Set up listener for balance changes
    if (publicKey && globalRaydiumInstance) {
      const id = connection.onAccountChange(publicKey, () => {
        fetchSolBalance();
        // Update Raydium instance owner if needed
        globalRaydiumInstance?.setOwner(publicKey);
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
