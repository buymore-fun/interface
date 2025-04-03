import { useState, useEffect, useCallback } from "react";
import { CpmmPoolInfo } from "@/types";
import { atom, useAtom } from "jotai";
import { useRaydium } from "@/hooks/use-raydium";

const poolInfoAtom = atom<CpmmPoolInfo | undefined>(undefined);

export function usePoolInfo(poolId: string) {
  const [poolInfo, setPoolInfo] = useAtom(poolInfoAtom);
  const { raydium } = useRaydium();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPoolInfo = useCallback(async () => {
    if (!raydium || !poolId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const poolInfo = await raydium.cpmm.getPoolInfoFromRpc(poolId);

      console.log("🚀 ~ poolInfo:", poolInfo.poolInfo);
      if (poolInfo) {
        setPoolInfo(poolInfo);
      }
    } catch (err) {
      console.error("Error fetching pool info:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [raydium, poolId]);

  useEffect(() => {
    if (raydium) {
      fetchPoolInfo();
    }
  }, [raydium]);

  return { poolInfo, fetchPoolInfo, isLoading, error };
}
