"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { swap } from "@/lib/raydium/swap";
import { useAnchorProvider } from "@/app/solana-provider";
import { useTransactionToast } from "@/hooks/use-transaction-toast";
import { useAtom } from "jotai";
import { raydiumPoolIdStorage } from "./atoms";
import { useRaydium } from "@/hooks/use-raydium";
export function SwapCard() {
  const [swapping, setSwapping] = useState(false);
  const [poolInfo, setPoolInfo] = useState<any>(null);
  const [raydiumPoolId, setRaydiumPoolId] = useAtom(raydiumPoolIdStorage);
  const { raydium } = useRaydium();

  const provider = useAnchorProvider();
  const transactionToast = useTransactionToast();

  const handleSwap = async () => {
    try {
      setSwapping(true);
      const poolInfo = await raydium?.liquidity.getPoolInfoFromRpc({ poolId: raydiumPoolId });
      setPoolInfo(poolInfo?.poolInfo);
      console.log("🚀 ~ handleSwap ~ poolInfo:", poolInfo);
      const transaction = await swap();

      // Sign the transaction with the wallet
      const signature = await provider!.sendAndConfirm(transaction);
      transactionToast(signature);
    } catch (error) {
      console.error("Failed to swap:", error);
    } finally {
      setSwapping(false);
    }
  };

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
          <Button onClick={handleSwap} className="w-full" variant="default">
            {swapping ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Swapping...
              </>
            ) : (
              <span className="text-white">Swap</span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
