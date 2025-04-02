import { useCallback, useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import redstone from "redstone-api";

export const solPriceAtom = atom<number>(0);

export function useSolPrice() {
  const [solPrice, setSolPrice] = useAtom(solPriceAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSolPrice = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const price = await redstone.getPrice("SOL");

      // console.log("🚀 ~ fetchSolPrice ~ price:", price.value);
      setSolPrice(price.value);
    } catch (error) {
      console.error("Error fetching SOL price:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
      setSolPrice(0);
    } finally {
      setIsLoading(false);
    }
  }, [setSolPrice]);

  return {
    solPrice,
    fetchSolPrice,
    isLoading,
    error,
  };
}
