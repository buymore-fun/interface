"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useHybirdTradeProgram } from "@/hooks/hybird-trade/hybird-trade-data-access";
import { OrderType } from "@/consts/order";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAtom } from "jotai";
import { BN } from "@coral-xyz/anchor";
import { inAmountStorage, outAmountStorage, orderTypeStorage, poolIdStorage } from "./atoms";

export function AddOrderCard() {
  const { address } = useParams();
  const [addingSOLOrder, setAddingSOLOrder] = useState(false);

  const [inAmount, setInAmount] = useAtom(inAmountStorage);
  const [outAmount, setOutAmount] = useAtom(outAmountStorage);
  const [orderType, setOrderType] = useAtom(orderTypeStorage);
  const [poolId, setPoolId] = useAtom(poolIdStorage);

  const hybirdTradeProgram = useHybirdTradeProgram(address as string);

  const handleAddOrder = async () => {
    // setAddingSOLOrder(true);
    // try {
    //   await hybirdTradeProgram.addOrder(
    //     new BN(Number(inAmount) * 10000),
    //     new BN(Number(outAmount) * 1000),
    //     orderType,
    //     new BN(poolId)
    //   );
    // } catch (error) {
    //   console.error("Failed to add order:", error);
    // } finally {
    //   setAddingSOLOrder(false);
    // }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white">Add SOL Order</CardTitle>
        <CardDescription>Create a new order with SOL</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inAmount" className="text-white">
              In Amount
            </Label>
            <Input
              id="inAmount"
              value={inAmount}
              onChange={(e) => setInAmount(e.target.value)}
              placeholder="Enter in amount"
              type="number"
              step="0.01"
              className="text-white"
            />
            <Label htmlFor="outAmount" className="text-white">
              Out Amount
            </Label>
            <Input
              id="outAmount"
              value={outAmount}
              onChange={(e) => setOutAmount(e.target.value)}
              placeholder="Enter out amount"
              type="number"
              step="0.01"
              className="text-white"
            />
            <Label htmlFor="orderType" className="text-white">
              Order Type
            </Label>
            <RadioGroup
              id="orderType"
              value={orderType.toString()}
              onValueChange={(value) => setOrderType(Number(value))}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={`${OrderType.Buy}`} id="buy" />
                <Label htmlFor="buy" className="text-white">
                  Buy
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={`${OrderType.Sell}`} id="sell" />
                <Label htmlFor="sell" className="text-white">
                  Sell
                </Label>
              </div>
            </RadioGroup>
            <Label htmlFor="poolId" className="text-white">
              Pool ID
            </Label>
            <Input
              id="poolId"
              value={poolId}
              onChange={(e) => setPoolId(Number(e.target.value))}
              placeholder="Enter pool ID"
              type="number"
              className="text-white"
            />
          </div>
          <Button onClick={handleAddOrder} className="w-full" disabled={!inAmount || !outAmount}>
            {addingSOLOrder ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding SOL Order...
              </>
            ) : (
              "Add SOL Order"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
