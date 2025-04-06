import { useEffect, useMemo, useState } from "react";
import { ArrowDownUp, Wallet } from "lucide-react";
import { SOL_ADDRESS } from "@/lib/constants";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { TokenIcon } from "../token-icon";
import { useWallet } from "@solana/wallet-adapter-react";
import { formatBalance, formatNumber } from "@/lib/utils";
import { useConnectWalletModalOpen } from "@/hooks/use-connect-wallet-modal";
import Image from "next/image";
import { ChevronsUpDown } from "../ui/icon";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";
import { Separator } from "@/components/ui/separator";
import TooltipWrapper from "@/components/tooltip-wrapper";
import { OrderPanelDexComparison } from "@/components/order-pannel/order-panel-dex-comparison";
import { OrderPanelRouting } from "@/components/order-pannel/order-panel-routing";
import { useAtom } from "jotai";
import { Switch } from "@/components/ui/switch";
import { SlippageButton, SlippageCustomButton } from "@/components/order-pannel/slippage-button";
import { useToken } from "@/hooks/use-token";
import { useTokenBalance } from "@/hooks/use-token-balance";
import { slippageAtom } from "@/components/order-pannel/atom";
import { useSolBalance } from "@/hooks/use-sol-balance";
import { useHybirdTradeProgram } from "@/hooks/hybird-trade/hybird-trade-data-access";
import { useCpmmPoolFetchOne, useOrderbookDepth } from "@/hooks/services";
import { usePoolInfo } from "@/hooks/use-pool-info";
import { getCurrentPrice } from "@/lib/calc";
import Decimal from "decimal.js";
import { BN } from "@coral-xyz/anchor";

interface MarketTabProps {
  poolId: string;
  setSlippageDialogOpen: (open: boolean) => void;
}

export function MarketTab({ poolId, setSlippageDialogOpen }: MarketTabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [slippage, setSlippage] = useAtom(slippageAtom);
  const [, setConnectWalletModalOpen] = useConnectWalletModalOpen();

  const { poolInfo, isLoading: isPoolLoading, fetchPoolInfo } = usePoolInfo(poolId);
  const { data: poolInfoData, isLoading: isPoolInfoLoading } = useCpmmPoolFetchOne({
    pool_id: poolId,
  });

  const token = useToken(poolId);
  const SOL = useToken(SOL_ADDRESS);

  const { solBalance, fetchSolBalance, isLoading } = useSolBalance();
  const tokenBalance = useTokenBalance(token);

  const [orderTokenAAmount, setOrderTokenAAmount] = useState("");
  const [orderTokenBAmount, setOrderTokenBAmount] = useState("");

  const { publicKey } = useWallet();
  const [isQuoting, setIsQuoting] = useState(false);
  const [isReverse, setIsReverse] = useState(true);

  const [tokenA, tokenB] = useMemo(
    () => (isReverse ? [SOL, token] : [token, SOL]),
    [isReverse, token, SOL]
  );

  const [inputToken, outputToken] = useMemo(
    () =>
      isReverse
        ? [poolInfo?.poolInfo.mintA, poolInfo?.poolInfo.mintB]
        : [poolInfo?.poolInfo.mintB, poolInfo?.poolInfo.mintA],
    [isReverse, poolInfo]
  );

  const [mintDecimalA, mintDecimalB] = isReverse
    ? [poolInfo?.poolInfo.mintA.decimals, poolInfo?.poolInfo.mintB.decimals]
    : [poolInfo?.poolInfo.mintB.decimals, poolInfo?.poolInfo.mintA.decimals];

  const [inputTokenAmount, outputTokenAmount] = useMemo(() => {
    if (!poolInfo?.poolInfo || !orderTokenAAmount || !orderTokenBAmount) {
      return [0, 0];
    }

    const inAmount = new Decimal(orderTokenAAmount)
      .mul(new Decimal(10).pow(mintDecimalA!))
      .floor()
      .toString();

    const outAmount = new Decimal(orderTokenBAmount)
      .mul(new Decimal(10).pow(mintDecimalB!))
      .floor()
      .toString();

    return [inAmount, outAmount];
  }, [poolInfo, orderTokenAAmount, orderTokenBAmount, mintDecimalA, mintDecimalB]);

  useEffect(() => {
    if (orderTokenAAmount && poolInfo?.poolInfo.price) {
      if (isReverse) {
        const _orderTokenBAmount = new Decimal(orderTokenAAmount)
          .mul(new Decimal(poolInfo?.poolInfo.price))
          .toString();

        setOrderTokenBAmount(_orderTokenBAmount);
      } else {
        const _orderTokenBAmount = new Decimal(orderTokenAAmount)
          .div(new Decimal(poolInfo?.poolInfo.price))
          .toString();

        setOrderTokenBAmount(_orderTokenBAmount);
      }
    }
  }, [orderTokenAAmount, poolInfo?.poolInfo.price, setOrderTokenBAmount, isReverse]);

  // const price = getCurrentPrice(poolInfo, false);

  console.log(getCurrentPrice(poolInfo, !isReverse));

  // should reverse input and output token
  const { data: orderbookDepthData, mutate } = useOrderbookDepth({
    input_token: outputToken?.address,
    output_token: inputToken?.address,
    price: getCurrentPrice(poolInfo, !isReverse),
  });

  const [tokenABalance, tokenBBalance] = useMemo(
    () =>
      isReverse ? [solBalance ?? undefined, tokenBalance] : [tokenBalance, solBalance ?? undefined],
    [isReverse, tokenBalance, solBalance]
  );

  const toggleToken = () => {
    setIsReverse((reverse) => !reverse);
  };

  const onPercentButtonClick = (percent: number) => {
    if (!publicKey) {
      setConnectWalletModalOpen(true);
      return;
    }

    if (!tokenABalance) return;

    const maxAmount = isReverse ? (solBalance ?? undefined) : tokenBalance;
    if (!maxAmount) return;

    const calculatedAmount = new Decimal(+maxAmount)
      .mul(new Decimal(percent))
      .div(new Decimal(100))
      .div(new Decimal(10).pow(mintDecimalA!))
      .toString();

    setOrderTokenAAmount(calculatedAmount);
  };

  const onSlippageClick = (value: number) => {
    setSlippage(value);
  };

  // useEffect(() => {
  //   if (!orderTokenAAmount) {
  //     setIsQuoting(false);
  //     setOrderTokenBAmount("");
  //     return;
  //   }
  //   // setIsQuoting(true);
  //   // setTimeout(() => {
  //   //   setTokenBAmount("0.01");
  //   //   setIsQuoting(false);
  //   // }, 2000);
  // }, [orderTokenAAmount]);

  const hybirdTradeProgram = useHybirdTradeProgram(poolId);

  const handleBuy = async () => {
    const orderBook = await mutate();
    console.log("🚀 ~ handleBuy ~ orderBook:", orderBook);
    if (!orderBook || !poolInfo || !poolInfoData) return;

    const trades = [
      {
        poolIndex: new BN(orderBook[0].pool_id),
        orderId: new BN(orderBook[0].order_id),
      },
    ];

    console.group("handleBuy");
    console.log("orderTokenAAmount", orderTokenAAmount);
    console.log("orderTokenBAmount", orderTokenBAmount);
    console.log("inputTokenAmount", inputTokenAmount);
    console.log("outputTokenAmount", outputTokenAmount);
    console.groupEnd();

    // try {
    await hybirdTradeProgram.trade_in_v1(
      // new BN(inputTokenAmount),
      // new BN(outputTokenAmount),
      new BN(+inputTokenAmount),
      new BN(+outputTokenAmount),
      poolInfoData,
      trades
    );
    // } catch (error) {
    //   console.log("🚀 ~ handleBuy ~ error:", error);
    // }
  };

  return (
    <div className="p-4">
      <div className="p-4 rounded-t-lg bg-accent">
        <div className="flex items-center justify-between h-6">
          <span className="text-sm">Selling</span>
          {tokenABalance !== undefined ? (
            <div className="flex space-x-2 items-center">
              <div className="flex items-center space-x-1">
                <Wallet className="text-muted-foreground size-3" />
                <span className="text-muted-foreground text-xs">
                  {formatBalance(tokenABalance)}
                </span>
              </div>
              <Button
                size="xs"
                variant="secondary"
                className="text-muted-foreground "
                onClick={() => onPercentButtonClick(25)}
              >
                25%
              </Button>
              <Button
                size="xs"
                variant="secondary"
                className="text-muted-foreground"
                onClick={() => onPercentButtonClick(50)}
              >
                50%
              </Button>
              <Button
                size="xs"
                variant="secondary"
                className="text-muted-foreground"
                onClick={() => onPercentButtonClick(100)}
              >
                100%
              </Button>
            </div>
          ) : publicKey ? (
            <Skeleton className="h-full w-24" />
          ) : null}
        </div>
        <div className="mt-2 flex">
          {tokenA ? (
            <Button variant="secondary" className="bg-secondary/60 hvoer:bg-secondary/60 px-2">
              <TokenIcon token={tokenA} size="sm" />
              {tokenA.symbol}
            </Button>
          ) : (
            <Skeleton className="h-9 w-24" />
          )}
          <Input
            className="border-none text-lg font-semibold text-right outline-none p-0"
            placeholder="0.00"
            onChange={(e) => setOrderTokenAAmount(e.target.value)}
            value={orderTokenAAmount}
          />
        </div>
      </div>
      <div className="flex items-center justify-center h-0 relative">
        <Button
          size="icon"
          className="rounded-full size-8 border-2 border-accent hover:text-foreground text-muted-foreground relative z-10"
          variant="secondary"
          onClick={() => toggleToken()}
        >
          <ArrowDownUp className="size-4" />
        </Button>
        <div className="absolute inset-x-0 top-[50%] bg-border/60 h-[1px]" />
      </div>
      <div className="pt-4 rounded-b-lg bg-light-card/70 border border-primary rounded-lg z-100 relative">
        <div className="px-4 flex items-center justify-between h-6 ">
          <span className="text-sm">Buying</span>
          {tokenBBalance !== undefined ? (
            <div className="flex items-center space-x-1 ">
              <Wallet className="text-muted-foreground size-3" />
              <span className="text-muted-foreground text-xs ">
                {formatNumber(tokenBBalance)} {tokenB?.symbol}
              </span>
            </div>
          ) : publicKey ? (
            <Skeleton className="h-full w-24" />
          ) : null}
        </div>
        <div className="mt-4 px-4 flex ">
          {tokenB ? (
            <Button variant="secondary" className="bg-light-card hover:bg-light-card px-2">
              <TokenIcon token={tokenB} size="sm" />
              {tokenB.symbol}
            </Button>
          ) : (
            <Skeleton className="h-9 w-24" />
          )}
          {isQuoting ? (
            <div className="flex-1 flex justify-end">
              <Skeleton className="w-32 h-8" />
            </div>
          ) : (
            <Input
              className="border-none text-lg disabled:cursor-not-allowed font-semibold text-right outline-none p-0"
              placeholder="0.00"
              value={orderTokenBAmount}
              readOnly
            />
          )}
        </div>

        <Separator className="my-4 bg-[#797979]" />

        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
          <OrderPanelRouting />

          <CollapsibleContent className="space-y-2">
            <OrderPanelDexComparison />
          </CollapsibleContent>

          <div className="flex items-center justify-center">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronsUpDown isOpen={isOpen} />
              </Button>
            </CollapsibleTrigger>
          </div>
        </Collapsible>
      </div>
      <div className="my-3 text-sm flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-white">Slippage</span>
          <span>
            <div className="flex space-x-2 items-center">
              <SlippageButton
                slippage={1}
                onClick={() => onSlippageClick(1)}
                selected={slippage === 1}
              />
              <SlippageButton
                slippage={5}
                onClick={() => onSlippageClick(5)}
                selected={slippage === 5}
              />
              <SlippageButton
                slippage={10}
                onClick={() => onSlippageClick(10)}
                selected={slippage === 10}
              />
              <SlippageCustomButton
                onClick={() => setSlippageDialogOpen(true)}
                selected={![1, 5, 10].includes(slippage)}
              />
            </div>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-white">Smart ordering</span>
            <TooltipWrapper
              content={
                <div>
                  {`We'll determine the fastest-executing order ratio based on current traders, volume, and orders to help you buy more.`}
                  <br />
                  Note: Tokens may not execute immediately—trade carefully.
                </div>
              }
            >
              <Image src="/assets/token/help.svg" alt="Help" width={10} height={10} />
            </TooltipWrapper>
            <span className="text-muted-foreground">0% Fee</span>
          </div>
          <span>
            <Switch color="primary" />
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-primary-highlight">Buymore</span>
          <span className="text-primary/80">≈+9.999 $USDC</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Order</span>
          <span className="text-muted-foreground">999.999(10%)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Limit Price</span>
          <span className="text-muted-foreground">$999.999</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Receive Amt</span>
          <span className="text-muted-foreground">999.999 $USDC</span>
        </div>
      </div>
      {publicKey ? (
        <Button
          className="w-full"
          size="lg"
          disabled={!orderTokenAAmount || !orderTokenBAmount}
          onClick={handleBuy}
        >
          Buy
        </Button>
      ) : (
        <Button className="w-full" size="lg" onClick={() => setConnectWalletModalOpen(true)}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
}
