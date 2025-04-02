import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { CpmmPoolInfo } from "@/types";
import { atom, useAtom } from "jotai";
import { useRaydium } from "@/hooks/use-raydium";

const poolInfoAtom = atom<CpmmPoolInfo | undefined>(undefined);

export function usePoolInfo() {
  const [poolInfo, setPoolInfo] = useAtom(poolInfoAtom);
  const { raydium } = useRaydium();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { publicKey } = useWallet();

  const fetchPoolInfo = useCallback(
    async (poolId: string) => {
      setIsLoading(true);
      setError(null);

      if (!poolId) return;

      try {
        const poolInfo = await raydium?.cpmm.getPoolInfoFromRpc(poolId);

        console.log("🚀 ~ poolInfo:", raydium?.ownerPubKey, poolInfo);
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
    [raydium, setPoolInfo]
  );

  return { poolInfo, fetchPoolInfo, isLoading, error };

  // const { publicKey } = useWallet();

  // const { data, error, isLoading, mutate } = useSWR(poolId, async (poolId: string) => {
  //   if (!poolId || !publicKey) return undefined;
  //   const poolInfo = await raydium?.cpmm.getPoolInfoFromRpc(poolId);
  //   return poolInfo;
  // });

  // return {
  //   data,
  //   error,
  //   isLoading,
  //   mutate,
  // };

  // const [data, setData] = useState<CpmmPoolInfo>();
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [error, setError] = useState<Error | null>(null);
  // const { publicKey } = useWallet();

  // const fetchPoolInfo = useCallback(async () => {
  //   if (!poolId) return;

  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     const poolInfo = await raydium?.cpmm.getPoolInfoFromRpc(poolId);
  //     setData(poolInfo);
  //   } catch (err) {
  //     console.error("Error fetching pool info:", err);
  //     setError(err instanceof Error ? err : new Error(String(err)));
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [poolId]);

  // useEffect(() => {
  //   if (!raydium?.ownerPubKey) return;
  //   fetchPoolInfo();
  // }, [poolId, publicKey, fetchPoolInfo]);

  // const mutate = useCallback(() => {
  //   fetchPoolInfo();
  // }, [fetchPoolInfo]);

  // return { data, isLoading, error, mutate };
}
