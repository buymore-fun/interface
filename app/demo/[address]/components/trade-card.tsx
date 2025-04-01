"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useHybirdTradeProgram } from "@/hooks/hybird-trade/hybird-trade-data-access";
import { useAtom } from "jotai";
import { tradeInAmountStorage, tradeOutAmountStorage } from "./atoms";
import { raydium } from "@/lib/raydium";
import { publicKey } from "@raydium-io/raydium-sdk-v2";

export function TradeCard() {
  const { address } = useParams();
  const [trading, setTrading] = useState(false);
  const [tradeInAmount, setTradeInAmount] = useAtom(tradeInAmountStorage);
  const [tradeOutAmount, setTradeOutAmount] = useAtom(tradeOutAmountStorage);

  const hybirdTradeProgram = useHybirdTradeProgram(address as string);

  const handleTrade = async () => {
    try {
      setTrading(true);
      await hybirdTradeProgram.trade_in(Number(tradeInAmount), Number(tradeOutAmount));
    } catch (error) {
      console.error("Failed to trade:", error);
    } finally {
      setTrading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white">Trade</CardTitle>
        <CardDescription>Trade tokens</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tradeInAmount" className="text-white">
              Input Amount (SOL)
            </Label>
            <Input
              id="tradeInAmount"
              value={tradeInAmount}
              onChange={(e) => setTradeInAmount(e.target.value)}
              placeholder="Enter input amount"
              className="text-white"
            />

            <Label htmlFor="tradeOutAmount" className="text-white mt-4">
              Output Amount (Token)
            </Label>
            <Input
              id="tradeOutAmount"
              value={tradeOutAmount}
              onChange={(e) => setTradeOutAmount(e.target.value)}
              placeholder="Enter output amount"
              className="text-white"
            />

            <Button
              onClick={handleTrade}
              className="w-full mt-4"
              variant="default"
              disabled={trading || !tradeInAmount || !tradeOutAmount}
            >
              {trading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Trading...
                </>
              ) : (
                <span className="text-white">Trade</span>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
