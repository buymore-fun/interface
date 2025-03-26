"use client";

import { Chart } from "@/components/chart";
import { TokenInfo } from "@/components/token-info";
import { OrderPanel } from "@/components/order-pannel/order-panel";
import { Community } from "@/components/community";
import { Overview } from "@/components/overview";
import { Activities } from "@/components/activities";
import { useParams } from "next/navigation";
import { useChartData } from "@/hooks/use-chart";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ChartType } from "@/types/chart";
import { useHybirdTradeProgram } from "@/hooks/hybird-trade/hybird-trade-data-access";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletAuth } from "@/components/wallet-auth";
import { BN } from "@coral-xyz/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { atomWithStorage } from "jotai/utils";
import { OrderType } from "@/anchor/constants";
import { useAtom } from "jotai";
import { swap } from "@/lib/raydium/swap";
import { connection, raydium } from "@/lib/raydium/config";
import { useAnchorProvider } from "@/app/solana-provider";
import { useTransactionToast } from "@/hooks/use-transaction-toast";
import { NATIVE_MINT } from "@solana/spl-token";
import { PoolsApiReturn } from "@raydium-io/raydium-sdk-v2";
export default function DemoPage() {
  const { address } = useParams();

  const isVerified = useMemo(() => {
    return PublicKey.isOnCurve(address as string);
  }, [address]);

  if (!isVerified) {
    return <div>Invalid Token Address</div>;
  }

  return (
    <WalletAuth>
      <DemoPageContent />
    </WalletAuth>
  );
}

const inAmountStorage = atomWithStorage("demo_in_amount", "");
const outAmountStorage = atomWithStorage("demo_out_amount", "");
const orderTypeStorage = atomWithStorage("demo_order_type", OrderType.Buy);
const poolIdStorage = atomWithStorage("demo_pool_id", 1);

// http://localhost:3000/demo/9T7uw5dqaEmEC4McqyefzYsEg5hoC4e2oV8it1Uc4f1U
function DemoPageContent() {
  const { address } = useParams();

  const wallet = useWallet();

  const hybirdTradeProgram = useHybirdTradeProgram(address as string);

  // State for form inputs
  const [poolAmount, setPoolAmount] = useState("");
  const [solAmount, setSolAmount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [orderId, setOrderId] = useState("");

  const [inAmount, setInAmount] = useAtom(inAmountStorage);
  const [outAmount, setOutAmount] = useAtom(outAmountStorage);
  const [orderType, setOrderType] = useAtom(orderTypeStorage);
  const [poolId, setPoolId] = useAtom(poolIdStorage);
  const transactionToast = useTransactionToast();

  // Loading states
  const [initializingBuymoreProgram, setInitializingBuymoreProgram] = useState(false);
  const [initializingPool, setInitializingPool] = useState(false);
  const [addingSOLOrder, setAddingSOLOrder] = useState(false);
  const [addingTokenOrder, setAddingTokenOrder] = useState(false);
  const [cancelingOrder, setCancelingOrder] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [poolInfo, setPoolInfo] = useState<any>(null);
  const [raydiumPoolId, setRaydiumPoolId] = useState<string>(
    "26auA3dMfiqK8SWBCkzShhkaSTbbWYQ3jrwhBQZCW5gT"
  );

  const [allPoolInfo, setAllPoolInfo] = useState<any>(null);

  const [tokenMintAddress, setTokenMintAddress] = useState<string>(
    "9T7uw5dqaEmEC4McqyefzYsEg5hoC4e2oV8it1Uc4f1U"
  );
  const [poolByMints, setPoolByMints] = useState<PoolsApiReturn>();

  const provider = useAnchorProvider();

  const fetchPoolByMints = async () => {
    const poolByMints = await raydium?.api.fetchPoolByMints({
      mint1: NATIVE_MINT,
      mint2: new PublicKey(tokenMintAddress),
    });

    console.log("🚀 ~ fetchPoolByMints ~ poolByMints:", poolByMints);
    setPoolByMints(poolByMints);
  };

  const getAllPoolInfo = async () => {
    try {
      // const allPoolInfo = await raydium?.liquidity.getRpcPoolInfos([raydiumPoolId]);
      const allPoolInfo = await raydium?.liquidity.getPoolInfoFromRpc({ poolId: raydiumPoolId });
      setAllPoolInfo(allPoolInfo);
    } catch (error) {
      console.error("Failed to swap:", error);
    } finally {
      setSwapping(false);
    }
  };

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

  const handleInitializePool = async () => {
    // if (!poolAmount) return;
    // await hybirdTradeProgram.fetchPoolData();
    // console.log("111");
    // const data = await hybirdTradeProgram.fetchPoolData();
    // console.log("🚀 ~ handleInitializePool ~ data:", data);

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

  // const handleInitializeBuymoreProgram = async () => {
  //   setInitializingBuymoreProgram(true);
  //   try {
  //     await hybirdTradeProgram.initializeBuymoreProgram();
  //   } catch (error) {
  //     console.error("Failed to initialize buymore program:", error);
  //   } finally {
  //     setInitializingBuymoreProgram(false);
  //   }
  // };

  const handleAddOrder = async () => {
    // if (!solAmount) return;
    setAddingSOLOrder(true);

    try {
      await hybirdTradeProgram.addOrder(new BN(10000), new BN(1000), 0, new BN(1));
    } catch (error) {
      console.error("Failed to add order:", error);
    } finally {
      setAddingSOLOrder(false);
    }
  };

  // const handleAddTokenOrder = async () => {
  //   if (!tokenAmount) return;
  //   setAddingTokenOrder(true);
  //   try {
  //     await hybirdTradeProgram.addTokenOrder(address as string, parseFloat(tokenAmount));
  //   } catch (error) {
  //     console.error("Failed to add token order:", error);
  //   } finally {
  //     setAddingTokenOrder(false);
  //   }
  // };

  const handleCancelOrder = async () => {
    if (!orderId) return;
    setCancelingOrder(true);
    try {
      await hybirdTradeProgram.cancelOrder(1, 1, +orderId);
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
            {/* <Card>
              <CardHeader>
                <CardTitle className="text-white">Initialize Buymore Program</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={handleInitializeBuymoreProgram} className="w-full">
                    {initializingBuymoreProgram ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      "Initialize Buymore Program"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card> */}

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
                  <Button
                    onClick={handleAddOrder}
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

            {/* <Card>
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
            </Card> */}

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

            <Card>
              <CardHeader>
                <CardTitle className="text-white">Raydium Pool By Mint Address</CardTitle>
                <CardDescription>Raydium pool info by mint address</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tokenMintAddress" className="text-white">
                      Token Mint Address
                    </Label>
                    <Input
                      id="tokenMintAddress"
                      value={tokenMintAddress}
                      onChange={(e) => setTokenMintAddress(e.target.value)}
                      placeholder="Enter token mint address"
                      className="text-white"
                    />
                  </div>
                  {poolByMints && (
                    <div className="mt-4 p-4 bg-gray-800 rounded-md overflow-auto max-h-96">
                      <pre className="text-xs text-white whitespace-pre-wrap">
                        {JSON.stringify(poolByMints, null, 2)}
                      </pre>
                    </div>
                  )}
                  <Button onClick={fetchPoolByMints} className="w-full" variant="default">
                    Fetch Pool By Mint Address
                  </Button>
                </div>
              </CardContent>
            </Card>

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

            <Card>
              <CardHeader>
                <CardTitle className="text-white">Get Pool Info</CardTitle>
                <CardDescription>Get pool info</CardDescription>
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
                    {allPoolInfo && (
                      <div className="space-y-2">
                        <pre className="bg-gray-800 text-white p-2 rounded-md text-xs overflow-auto max-h-40">
                          {JSON.stringify(allPoolInfo, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                  <Button onClick={getAllPoolInfo} className="w-full" variant="default">
                    Get Pool Info
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
