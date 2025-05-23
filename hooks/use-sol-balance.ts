import { useCallback, useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, TokenAmount, PublicKey } from "@solana/web3.js";
import { atom, useAtom } from "jotai";
import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useRaydium } from "@/hooks/use-raydium";
import redstone from "redstone-api";

export const solBalanceAtom = atom<number>(0);

export function useSolBalance() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [solBalance, setSolBalance] = useAtom(solBalanceAtom);
  const [isLoading, setIsLoading] = useState(false);

  const getFormattedSolBalance = useCallback((balance: number) => {
    return (balance / LAMPORTS_PER_SOL).toFixed(3);
  }, []);

  const formattedSolBalance = useMemo(() => {
    return getFormattedSolBalance(solBalance);
  }, [solBalance, getFormattedSolBalance]);

  const fetchSolBalance = useCallback(async () => {
    if (!wallet.publicKey) return;
    setIsLoading(true);

    try {
      const balance = await connection.getBalance(wallet.publicKey);
      console.log("🚀 ~ fetchSolBalance ~ balance:", balance);
      setSolBalance(balance);
    } catch (error) {
      console.error("Error fetching SOL balance:", error);
      setSolBalance(0);
    } finally {
      setIsLoading(false);
    }
  }, [connection, wallet.publicKey, setSolBalance]);

  return {
    solBalance,
    formattedSolBalance,
    fetchSolBalance,
    isLoading,
  };
}

const tokenAmount = {
  amount: "0",
  decimals: 1,
  uiAmount: 0,
  uiAmountString: "0",
};

export function useTokenBalanceV2(tokenAddress: string = "") {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [tokenBalance, setTokenBalance] = useState<TokenAmount>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchTokenBalance = useCallback(
    async (tokenAddress: string) => {
      if (!wallet.publicKey || !tokenAddress) return;
      setIsLoading(true);

      const associatedTokenAccount = getAssociatedTokenAddressSync(
        new PublicKey(tokenAddress),
        wallet.publicKey
      );

      // const tokenAccount = await getAccount(connection, associatedTokenAccount);
      // console.log("🚀 ~ fetchTokenBalance ~ tokenAccount:", tokenAccount);

      // const tokenInfo = await raydium?.api.getTokenInfo([
      //   new PublicKey("9T7uw5dqaEmEC4McqyefzYsEg5hoC4e2oV8it1Uc4f1U"),
      // ]);
      // console.log("🚀 ~ fetchTokenBalance ~ tokenInfo:", tokenInfo);

      try {
        const tokenAccountInfo = await connection.getAccountInfo(associatedTokenAccount);
        if (tokenAccountInfo) {
          const tokenInfo = await connection.getTokenAccountBalance(associatedTokenAccount);
          console.log("🚀 ~ fetchSolBalance ~ tokenInfo:", tokenInfo.value);
          setTokenBalance(tokenInfo.value);
        } else {
          setTokenBalance(tokenAmount);
        }
      } catch (error) {
        console.error("Error fetching token balance:", error);
        setTokenBalance(tokenAmount);
      } finally {
        setIsLoading(false);
      }
    },
    [connection, wallet.publicKey]
  );

  const mutateTokenBalance = useCallback(async () => {
    await fetchTokenBalance(tokenAddress);
  }, [fetchTokenBalance, tokenAddress]);

  useEffect(() => {
    fetchTokenBalance(tokenAddress);
  }, [fetchTokenBalance, tokenAddress]);

  return {
    tokenBalance,
    fetchTokenBalance,
    mutateTokenBalance,
    isLoading,
  };
}
