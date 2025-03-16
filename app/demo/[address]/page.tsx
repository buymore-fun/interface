"use client";

import { Chart } from "@/components/chart";
import { TokenInfo } from "@/components/token-info";
import { OrderPanel } from "@/components/order-panel";
import { Community } from "@/components/community";
import { Overview } from "@/components/overview";
import { Activities } from "@/components/activities";
import { useParams } from "next/navigation";
import { useChartData } from "@/hooks/use-chart";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ChartType } from "@/types/chart";
import { useHybirdTradeProgram } from "@/components/hybird-trade/hybird-trade-data-access";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletAuth } from "@/components/wallet-auth";
import { BN } from "@coral-xyz/anchor";

export default function DemoPage() {
  return (
    <WalletAuth>
      <DemoPageContent />
    </WalletAuth>
  );
}

// http://localhost:3000/demo/6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN
export function DemoPageContent() {
  const { address } = useParams();
  // console.log("🚀 ~ Token ~ chartData:", chartData);
  const wallet = useWallet();

  const hybirdTradeProgram = useHybirdTradeProgram();

  // State for form inputs
  const [poolAmount, setPoolAmount] = useState("");
  const [solAmount, setSolAmount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [orderId, setOrderId] = useState("");

  // Loading states
  const [initializingPool, setInitializingPool] = useState(false);
  const [addingSOLOrder, setAddingSOLOrder] = useState(false);
  const [addingTokenOrder, setAddingTokenOrder] = useState(false);
  const [cancelingOrder, setCancelingOrder] = useState(false);

  const handleInitializePool = async () => {
    // if (!poolAmount) return;

    console.log("111");
    // const data = await hybirdTradeProgram.fetchPoolData();
    // console.log("🚀 ~ handleInitializePool ~ data:", data);
    debugger;

    setInitializingPool(true);
    try {
      // await hybirdTradeProgram.initializePool(+poolAmount);
      await hybirdTradeProgram.initializePool(10);
    } catch (error) {
      console.error("Failed to initialize pool:", error);
    } finally {
      setInitializingPool(false);
    }
  };

  const handleAddSOLOrder = async () => {
    if (!solAmount) return;
    setAddingSOLOrder(true);
    try {
      await hybirdTradeProgram.addSOLOrder();
    } catch (error) {
      console.error("Failed to add SOL order:", error);
    } finally {
      setAddingSOLOrder(false);
    }
  };

  const handleAddTokenOrder = async () => {
    if (!tokenAmount) return;
    setAddingTokenOrder(true);
    try {
      await hybirdTradeProgram.addTokenOrder(address as string, parseFloat(tokenAmount));
    } catch (error) {
      console.error("Failed to add token order:", error);
    } finally {
      setAddingTokenOrder(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderId) return;
    setCancelingOrder(true);
    try {
      await hybirdTradeProgram.cancelOrder(orderId);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      setCancelingOrder(false);
    }
  };

  return (
    <div className="flex gap-6 flex-col sm:flex-row">
      <div className="flex-1">
        <div className="flex flex-col">
          <div>
            <TokenInfo
              tokenAddress={address as string}
              type={ChartType.FIVE_MINUTE}
              onTypeChange={() => {}}
            />
          </div>

          {/* Hybrid Trade Functions UI */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-white">Initialize Pool</CardTitle>
                <CardDescription>Create a new trading pool with a custom amount</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="poolAmount" className="text-white">
                      Pool amount ( 10 )
                    </Label>
                    {/* <Input
                      id="poolAmount"
                      value={poolAmount}
                      onChange={(e) => setPoolAmount(e.target.value)}
                      placeholder="Enter pool amount"
                      className="text-white"
                    /> */}
                  </div>
                  <Button
                    onClick={handleInitializePool}
                    // disabled={initializingPool || !poolAmount}
                    className="w-full"
                  >
                    {initializingPool ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      "Initialize Pool"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-white">Add SOL Order</CardTitle>
                <CardDescription>Create a new order with SOL</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* <div className="space-y-2">
                    <Label htmlFor="solAmount" className="text-white">
                      SOL Amount
                    </Label>
                    <Input
                      id="solAmount"
                      value={solAmount}
                      onChange={(e) => setSolAmount(e.target.value)}
                      placeholder="Enter SOL amount"
                      type="number"
                      step="0.01"
                      className="text-white"
                    />
                  </div> */}
                  <Button
                    onClick={handleAddSOLOrder}
                    // disabled={addingSOLOrder || !solAmount}
                    className="w-full"
                  >
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

            <Card>
              <CardHeader>
                <CardTitle className="text-white">Add Token Order</CardTitle>
                <CardDescription>Create a new order with the current token</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tokenAmount" className="text-white">
                      Token Amount
                    </Label>
                    <Input
                      id="tokenAmount"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      placeholder="Enter token amount"
                      type="number"
                      step="0.01"
                      className="text-white"
                    />
                  </div>
                  <Button
                    onClick={handleAddTokenOrder}
                    disabled={addingTokenOrder || !tokenAmount}
                    className="w-full"
                  >
                    {addingTokenOrder ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding Token Order...
                      </>
                    ) : (
                      "Add Token Order"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-white">Cancel Order</CardTitle>
                <CardDescription>Cancel an existing order by ID</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderId" className="text-white">
                      Order ID
                    </Label>
                    <Input
                      id="orderId"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="Enter order ID"
                      className="text-white"
                    />
                  </div>
                  <Button
                    onClick={handleCancelOrder}
                    disabled={cancelingOrder || !orderId}
                    className="w-full"
                    variant="destructive"
                  >
                    {cancelingOrder ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Canceling Order...
                      </>
                    ) : (
                      <span className="text-white">Cancel Order</span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
