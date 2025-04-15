import { useState, useEffect, useCallback } from "react";
import { CpmmPoolInfo, IResponsePoolInfoItem } from "@/types";
import { atom, useAtom } from "jotai";
import { useRaydium } from "@/hooks/use-raydium";
import { getCpmmPoolFetchOne, useCpmmPoolFetchOne } from "@/hooks/services";

const raydiumPoolInfoAtom = atom<CpmmPoolInfo | undefined>(undefined);

export function useRaydiumPoolInfo() {
  const [raydiumPoolInfo, setRaydiumPoolInfo] = useAtom(raydiumPoolInfoAtom);
  const { raydium } = useRaydium();
  const [isRaydiumLoading, setIsRaydiumLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // const fetchRaydiumPoolInfo = useCallback(
  //   async (poolId: string) => {
  //     if (!raydium || !poolId || isRaydiumLoading) {
  //       return;
  //     }

  //     setIsRaydiumLoading(true);
  //     setError(null);

  //     try {
  //       const poolInfo = await raydium.cpmm.getPoolInfoFromRpc(poolId);

  //       console.log("🚀 ~ poolInfo:", poolInfo.poolInfo);
  //       if (poolInfo) {
  //         setRaydiumPoolInfo(poolInfo);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching pool info:", err);
  //       setError(err instanceof Error ? err : new Error(String(err)));
  //     } finally {
  //       setIsRaydiumLoading(false);
  //     }
  //   },
  //   [raydium, setRaydiumPoolInfo, isRaydiumLoading]
  // );

  const fetchRaydiumPoolInfo = async (poolId: string) => {
    if (!raydium || !poolId || isRaydiumLoading) {
      return;
    }

    setIsRaydiumLoading(true);
    setError(null);

    try {
      const poolInfo = await raydium.cpmm.getPoolInfoFromRpc(poolId);

      console.log("🚀 ~ fetchRaydiumPoolInfo:", poolInfo.poolInfo);
      if (poolInfo) {
        setRaydiumPoolInfo(poolInfo);
      }
    } catch (err) {
      console.error("Error fetching pool info:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsRaydiumLoading(false);
    }
  };

  return { raydiumPoolInfo, fetchRaydiumPoolInfo, isRaydiumLoading, error };
}

const servicePoolInfoAtom = atom<IResponsePoolInfoItem | undefined>(undefined);
const servicePoolInfoLoadingAtom = atom<boolean>(true);
const servicePoolInfoErrorAtom = atom<Error | null>(null);
const cancelPoolInfoAtom = atom<IResponsePoolInfoItem | undefined>(undefined);
const cancelPoolInfoLoadingAtom = atom<boolean>(true);
const cancelPoolInfoErrorAtom = atom<Error | null>(null);

export function useServicePoolInfo() {
  const [servicePoolInfo, setServicePoolInfo] = useAtom(servicePoolInfoAtom);
  const [isLoading, setIsLoading] = useAtom(servicePoolInfoLoadingAtom);
  const [error, setError] = useAtom(servicePoolInfoErrorAtom);

  const fetchServicePoolInfo = useCallback(
    async (inputMint: string, outputMint: string) => {
      // if (!inputMint || !outputMint || isLoading) {
      if (!inputMint || !outputMint) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getCpmmPoolFetchOne({ mint_a: inputMint, mint_b: outputMint });
        console.log("🚀 ~ fetchServicePoolInfo ~ response:", response);
        if (response) {
          setServicePoolInfo(response);
        }
      } catch (err) {
        console.error("Error fetching pool info:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    },
    [setServicePoolInfo, setIsLoading, setError]
  );
  // const fetchServicePoolInfo = async (inputMint: string, outputMint: string) => {
  //   // if (!inputMint || !outputMint || isLoading) {
  //   if (!inputMint || !outputMint) {
  //     return;
  //   }

  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     const response = await getCpmmPoolFetchOne({ mint_a: inputMint, mint_b: outputMint });
  //     if (response) {
  //       setServicePoolInfo(response);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching pool info:", err);
  //     setError(err instanceof Error ? err : new Error(String(err)));
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return {
    servicePoolInfo,
    fetchServicePoolInfo,
    isServicePoolInfoLoading: isLoading,
    error,
  };
}

export function useCancelPoolInfo() {
  const [cancelPoolInfo, setCancelPoolInfo] = useAtom(cancelPoolInfoAtom);
  const [isLoading, setIsLoading] = useAtom(cancelPoolInfoLoadingAtom);
  const [error, setError] = useAtom(cancelPoolInfoErrorAtom);

  const fetchCancelPoolInfo = useCallback(
    async (inputMint: string, outputMint: string) => {
      // if (!inputMint || !outputMint || isLoading) {
      if (!inputMint || !outputMint) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getCpmmPoolFetchOne({ mint_a: inputMint, mint_b: outputMint });
        console.log("🚀 ~ fetchServicePoolInfo ~ response:", response);
        if (response) {
          setCancelPoolInfo(response);
        }
      } catch (err) {
        console.error("Error fetching pool info:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    },
    [setCancelPoolInfo, setIsLoading, setError]
  );

  return {
    cancelPoolInfo,
    isCancelPoolInfoLoading: isLoading,
    cancelPoolInfoError: error,
    fetchCancelPoolInfo,
  };
}

// export function useServicePoolInfo() {
//   const [servicePoolInfo, setServicePoolInfo] = useAtom(servicePoolInfoAtom);
//   // const [isLoading, setIsLoading] = useState<boolean>(true);
//   // const [error, setError] = useState<Error | null>(null);

//   const [mintA, setMintA] = useState<string>("");
//   const [mintB, setMintB] = useState<string>("");

//   const {
//     mutate,
//     isLoading: isCpmmPoolFetchOneLoading,
//     error,
//   } = useCpmmPoolFetchOne({
//     mint_a: mintA,
//     mint_b: mintB,
//   });

//   // const fetchServicePoolInfo = useCallback(
//   //   async (inputMint: string, outputMint: string) => {
//   //     if (!inputMint || !outputMint) {
//   //       return;
//   //     }

//   //     setIsLoading(true);
//   //     setError(null);
//   //     // setMintA(inputMint);
//   //     // setMintB(outputMint);

//   //     try {
//   //       const response = await mutate();
//   //       if (response) {
//   //         setServicePoolInfo(response);
//   //       }
//   //     } catch (err) {
//   //       console.error("Error fetching pool info:", err);
//   //       setError(err instanceof Error ? err : new Error(String(err)));
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   },
//   //   [mutate, setServicePoolInfo]
//   // );

//   const setMintInfo = useCallback((mintA: string, mintB: string) => {
//     setMintA(mintA);
//     setMintB(mintB);
//   }, []);

//   const getMintInfo = useCallback(() => {
//     return { mintA, mintB };
//   }, [mintA, mintB]);

//   // useEffect(() => {
//   //   if (mintA && mintB) {
//   //     fetchServicePoolInfo(mintA, mintB);
//   //   }
//   // }, [mintA, mintB, fetchServicePoolInfo]);

//   return {
//     servicePoolInfo,
//     // fetchServicePoolInfo,
//     isServicePoolInfoLoading: isCpmmPoolFetchOneLoading,
//     error,
//     setMintInfo,
//   };
// }
