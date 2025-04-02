import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { connection, initSdk } from "@/lib/raydium/config";
import { PublicKey, Keypair } from "@solana/web3.js";
import {
  ApiV3PoolInfoStandardItem,
  AmmV4Keys,
  AmmRpcData,
  Raydium,
  parseTokenAccountResp,
} from "@raydium-io/raydium-sdk-v2";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

type PoolInfo = {
  poolInfo: ApiV3PoolInfoStandardItem;
  poolKeys: AmmV4Keys;
  poolRpcData: AmmRpcData;
};

export function useRaydium() {
  const { publicKey, connected } = useWallet();
  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSdkInitialized, setIsSdkInitialized] = useState(false);
  const [raydiumInstance, setRaydiumInstance] = useState<Raydium | null>(null);

  // Initialize Raydium SDK
  const initializeSdk = useCallback(async () => {
    if (!connected || !publicKey || isLoading || raydiumInstance) return;
    console.log("initializing sdk");

    try {
      setIsLoading(true);
      setError(null);
      const instance = await initSdk({ owner: publicKey, loadToken: true });
      setRaydiumInstance(instance);
      setIsSdkInitialized(true);
    } catch (err) {
      console.error("Error initializing Raydium SDK:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [connected, publicKey, isLoading, raydiumInstance]);

  // Initialize SDK when wallet is connected
  useEffect(() => {
    initializeSdk();
  }, [initializeSdk]);

  // Fetch pool info
  const fetchPoolInfo = useCallback(
    async (poolId: string) => {
      if (!poolId || !publicKey || !raydiumInstance || !isSdkInitialized) return;

      setIsLoading(true);
      setError(null);

      try {
        const poolInfo = await raydiumInstance.liquidity.getPoolInfoFromRpc({ poolId });
        if (poolInfo) {
          setPoolInfo(poolInfo);
        }
      } catch (err) {
        console.error("Error fetching pool info:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    },
    [publicKey, isSdkInitialized, raydiumInstance]
  );

  // Listen to account changes
  useEffect(() => {
    if (!publicKey || !isSdkInitialized) return;

    // Listen to SOL balance changes
    const solAccountId = connection.onAccountChange(publicKey, async () => {
      try {
        // Note: This is a simplified version since we can't create a Keypair from just a PublicKey
        // In a real application, you would need to handle this differently
        // console.log("Account balance changed:", publicKey.toString());
        raydiumInstance?.setOwner(publicKey);
      } catch (err) {
        console.error("Error updating token account:", err);
      }
    });

    return () => {
      connection.removeAccountChangeListener(solAccountId);
    };
  }, [publicKey, isSdkInitialized, raydiumInstance]);

  // Cleanup function
  useEffect(() => {
    return () => {
      // Cleanup any resources if needed
      setRaydiumInstance(null);
      setIsSdkInitialized(false);
    };
  }, []);

  const fetchTokenAccountData = async (publicKey: PublicKey) => {
    const solAccountResp = await connection.getAccountInfo(publicKey);
    const tokenAccountResp = await connection.getTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });
    const token2022Req = await connection.getTokenAccountsByOwner(publicKey, {
      programId: TOKEN_2022_PROGRAM_ID,
    });
    const tokenAccountData = parseTokenAccountResp({
      owner: publicKey,
      solAccountResp,
      tokenAccountResp: {
        context: tokenAccountResp.context,
        value: [...tokenAccountResp.value, ...token2022Req.value],
      },
    });

    return tokenAccountData;
  };

  return {
    poolInfo,
    isLoading,
    error,
    isSdkInitialized,
    raydium: raydiumInstance,
    fetchPoolInfo,
    initializeSdk,
  };
}
