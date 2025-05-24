"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { swap } from "@/lib/raydium/swap";
// import { useAnchorProvider } from "@/app/solana-provider";
import { usePrivyAnchorProvider } from "@/app/privy-provider";
import { useTransactionToast } from "@/hooks/use-transaction-toast";
import { useAtom } from "jotai";
import { raydiumPoolIdStorage } from "./atoms";
import { useRaydium } from "@/hooks/use-raydium";
import { usePrivyWallet } from "@/hooks/use-privy-wallet";
import { usePrivy } from "@privy-io/react-auth";
import { connection } from "@/lib/raydium/config";

export function SwapCard() {
  const [swapping, setSwapping] = useState(false);
  const [poolInfo, setPoolInfo] = useState<any>(null);
  const [raydiumPoolId, setRaydiumPoolId] = useAtom(raydiumPoolIdStorage);
  const { raydium } = useRaydium();
  const { publicKey } = usePrivyWallet();
  const { ready, authenticated } = usePrivy();
  const provider = usePrivyAnchorProvider();
  const transactionToast = useTransactionToast();

  const handleSwap = async () => {
    try {
      if (!ready || !authenticated) {
        throw new Error("Please connect your wallet first");
      }

      if (!provider) {
        throw new Error("Provider is not available");
      }

      if (!raydiumPoolId) {
        throw new Error("Please enter a pool ID");
      }

      setSwapping(true);
      const poolInfo = await raydium?.liquidity.getPoolInfoFromRpc({ poolId: raydiumPoolId });
      setPoolInfo(poolInfo?.poolInfo);

      const transaction = await swap();
      const signature = await provider.sendAndConfirm(transaction);
      transactionToast(signature);
    } catch (error) {
      console.error("Failed to swap:", error);
      // You might want to show this error to the user through a toast or alert
    } finally {
      setSwapping(false);
    }
  };

  const isDisabled = !ready || !authenticated || !publicKey || !provider || !raydiumPoolId;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white">Swap</CardTitle>
        <CardDescription>Swap tokens</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="raydiumPoolId" className="text-white">
              Raydium Pool ID
            </Label>
            <Input
              id="raydiumPoolId"
              value={raydiumPoolId}
              onChange={(e) => setRaydiumPoolId(e.target.value)}
              placeholder="Enter Raydium pool ID"
              className="text-white"
            />
            {poolInfo && (
              <div>
                <Label htmlFor="poolInfo" className="text-white">
                  pool price: {poolInfo.price}
                </Label>
              </div>
            )}
          </div>
          <Button onClick={handleSwap} className="w-full" variant="default" disabled={isDisabled}>
            {swapping ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Swapping...
              </>
            ) : (
              <span className="text-white">
                {!ready || !authenticated
                  ? "Connect Wallet"
                  : !raydiumPoolId
                    ? "Enter Pool ID"
                    : "Swap"}
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
