import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { connection } from "@/lib/raydium/config";
import { PublicKey } from "@solana/web3.js";
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

  const [raydiumInstance, setRaydiumInstance] = useState<Raydium | null>(null);

  // Listen to account changes
  useEffect(() => {
    if (!publicKey || !raydiumInstance) return;

    // Listen to SOL balance changes
    const solAccountId = connection.onAccountChange(publicKey, async () => {
      try {
        if (raydiumInstance) {
          raydiumInstance.setOwner(publicKey);
        }
      } catch (err) {
        console.error("Error updating token account:", err);
      }
    });

    return () => {
      connection.removeAccountChangeListener(solAccountId);
    };
  }, [publicKey]);

  // const fetchTokenAccountData = async (publicKey: PublicKey) => {
  //   const solAccountResp = await connection.getAccountInfo(publicKey);
  //   const tokenAccountResp = await connection.getTokenAccountsByOwner(publicKey, {
  //     programId: TOKEN_PROGRAM_ID,
  //   });
  //   const token2022Req = await connection.getTokenAccountsByOwner(publicKey, {
  //     programId: TOKEN_2022_PROGRAM_ID,
  //   });
  //   const tokenAccountData = parseTokenAccountResp({
  //     owner: publicKey,
  //     solAccountResp,
  //     tokenAccountResp: {
  //       context: tokenAccountResp.context,
  //       value: [...tokenAccountResp.value, ...token2022Req.value],
  //     },
  //   });

  //   return tokenAccountData;
  // };

  return {
    poolInfo,
    isLoading,
    error,
    raydium: raydiumInstance,
    setRaydiumInstance,
  };
}
