"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ArrowDownUp, Wallet } from "lucide-react";
import { SOL_ADDRESS } from "@/lib/constants";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { TokenIcon } from "../token-icon";
import { useWallet } from "@solana/wallet-adapter-react";
import { cn, formatBalance, formatFloor } from "@/lib/utils";
import { useConnectWalletModalOpen } from "@/hooks/use-connect-wallet-modal";
import { ChevronsUpDown } from "../ui/icon";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";
import { Separator } from "@/components/ui/separator";
import { OrderPanelDexComparison } from "@/components/order-pannel/order-panel-dex-comparison";
import { OrderPanelRouting } from "@/components/order-pannel/order-panel-routing";
import { useAtom } from "jotai";
import { SlippageButton, SlippageCustomButton } from "@/components/order-pannel/slippage-button";
import { useToken } from "@/hooks/use-token";
import { useTokenBalance } from "@/hooks/use-token-balance";
import { slippageAtom } from "@/components/order-pannel/atom";
import { useSolBalance, useTokenBalanceV2 } from "@/hooks/use-sol-balance";
import { useHybirdTradeProgram } from "@/hooks/hybird-trade/hybird-trade-data-access";
import { getOrderbookDepth } from "@/hooks/services";
import { debounce } from "lodash";

import Decimal from "decimal.js";
import { BN } from "@coral-xyz/anchor";
import { ApiV3Token, div, isNumber } from "@raydium-io/raydium-sdk-v2";
import useBoolean from "@/hooks/use-boolean";
import { LoadingButton } from "@/components/ui/loading-button";
import { useRaydiumPoolInfo, useServicePoolInfo } from "@/hooks/use-pool-info";
import { getCurrentPrice, getCurrentPriceInUSD, getSymbolFromPoolInfo } from "@/lib/calc";
import TooltipWrapper from "@/components/tooltip-wrapper";
import Image from "next/image";
// import toast from "react-hot-toast";
import { useSolPrice } from "@/hooks/use-sol-price";
import { CpmmPoolInfo } from "@/types/raydium";
import { useCommonToast } from "@/hooks/use-common-toast";
import { TokenSelector } from "@/components/token-selector";

interface MarketTabProps {
  setSlippageDialogOpen: (open: boolean) => void;
}

export interface Routing {
  dexRatio: string;
  orderRatio: string;
  buyMore: string;
  onlySwap: string;
  minReceive: string;
  maxReceive: string;
  fee: string;
  inputUsd: string;
  outputUsd: string;
  resultSlippage: string;
  resultSlippageFormatted: string;
}

export function MarketTab({ setSlippageDialogOpen }: MarketTabProps) {
  const { errorToast } = useCommonToast();
  const { fetchRaydiumPoolInfo } = useRaydiumPoolInfo();
  const [isOpen, setIsOpen] = useState(false);
  const [slippage, setSlippage] = useAtom(slippageAtom);
  const [, setConnectWalletModalOpen] = useConnectWalletModalOpen();
  const { solPrice, isLoading: isSolPriceLoading } = useSolPrice();
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const { servicePoolInfo } = useServicePoolInfo();
  const { raydiumPoolInfo } = useRaydiumPoolInfo();

  const token = useToken(servicePoolInfo!.cpmm?.mintB);
  const SOL = useToken(SOL_ADDRESS);
  const isSubmitting = useBoolean();

  const { solBalance, fetchSolBalance, isLoading } = useSolBalance();

  const { tokenBalance, mutateTokenBalance } = useTokenBalanceV2(
    raydiumPoolInfo?.poolInfo.mintB.address
  );

  const [orderTokenAAmount, setOrderTokenAAmount] = useState("");
  const [orderTokenBAmount, setOrderTokenBAmount] = useState("");

  const { publicKey } = useWallet();
  const [isQuoting, setIsQuoting] = useState(false);
  const [isReverse, setIsReverse] = useState(true);

  const [percent, setPercent] = useState(0);
  const [calculatedAmount, setCalculatedAmount] = useState("");
  const [routing, setRouting] = useState<Routing>({
    onlySwap: "",
    dexRatio: "",
    orderRatio: "",
    buyMore: "",
    minReceive: "",
    maxReceive: "",
    fee: "",
    inputUsd: "0",
    outputUsd: "0",
    resultSlippage: "",
    resultSlippageFormatted: "",
  });

  const [isDisableSlippage, setIsDisableSlippage] = useState(false);

  const [tokenA, tokenB] = useMemo(
    () => (isReverse ? [SOL, token] : [token, SOL]),
    [isReverse, token, SOL]
  );

  const [inputToken, outputToken] = useMemo(() => {
    if (!raydiumPoolInfo?.poolInfo) {
      return [undefined, undefined];
    }

    const mintA = { ...raydiumPoolInfo.poolInfo.mintA } as ApiV3Token;
    const mintB = { ...raydiumPoolInfo.poolInfo.mintB } as ApiV3Token;

    // Safely assign symbols if they're missing
    if (mintA && !mintA.symbol) {
      mintA.symbol = tokenA?.symbol as string;
    }

    if (mintB && !mintB.symbol) {
      mintB.symbol = tokenB?.symbol as string;
    }

    return isReverse ? [mintA, mintB] : [mintB, mintA];
  }, [isReverse, raydiumPoolInfo, tokenA, tokenB]);

  const mintDecimalA = inputToken?.decimals;
  const mintDecimalB = outputToken?.decimals;

  const [inputTokenAmount, outputTokenAmount] = useMemo(() => {
    if (!raydiumPoolInfo?.poolInfo || !orderTokenAAmount || !orderTokenBAmount) {
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
  }, [raydiumPoolInfo, orderTokenAAmount, orderTokenBAmount, mintDecimalA, mintDecimalB]);

  const [tokenABalance, tokenBBalance] = useMemo(
    () =>
      isReverse
        ? [solBalance, tokenBalance?.uiAmountString || 0]
        : [tokenBalance?.uiAmountString || 0, solBalance],
    [isReverse, tokenBalance, solBalance]
  );

  const [formatedTokenABalance, formatedTokenBBalance] = useMemo(() => {
    console.log(
      "~formatBalance",
      formatBalance(solBalance, 9),
      formatFloor(formatBalance(solBalance, 9))
    );

    if (!inputToken || !outputToken) {
      return [undefined, undefined];
    }

    return isReverse
      ? [
          `${formatFloor(formatBalance(solBalance, 9))} ${getSymbolFromPoolInfo(inputToken)}`,
          `${formatFloor(tokenBalance?.uiAmountString || "0")} ${getSymbolFromPoolInfo(outputToken)}`,
        ]
      : [
          `${formatFloor(tokenBalance?.uiAmountString || "0")} ${getSymbolFromPoolInfo(inputToken)}`,
          `${formatFloor(formatBalance(solBalance, 9))} ${getSymbolFromPoolInfo(outputToken)}`,
        ];
  }, [isReverse, solBalance, tokenBalance, outputToken, inputToken]);

  const [currentAAmount, currentBAmount] = useMemo(() => {
    return isReverse
      ? [solBalance, tokenBalance?.amount || 0]
      : [tokenBalance?.amount || 0, solBalance];
  }, [isReverse, tokenBalance, solBalance]);

  const [priceState, setPriceState] = useState(0);

  const recalculateUSDValues = useCallback(() => {
    setPriceState((prevPrice) => {
      return prevPrice;
    });
  }, []);

  useEffect(() => {
    recalculateUSDValues();
  }, [orderTokenAAmount, orderTokenBAmount, recalculateUSDValues]);

  useEffect(() => {
    handleQuery(orderTokenAAmount);
  }, [slippage, priceState]);

  // Add effect to reset isDisableSlippage when slippage changes
  useEffect(() => {
    // Reset the disable flag when slippage changes (like from custom dialog)
    setIsDisableSlippage(false);
  }, [slippage]);

  const hybirdTradeProgram = useHybirdTradeProgram();
  const { SwapInfo } = hybirdTradeProgram;

  const FromUSdPrice = useMemo(() => {
    return isReverse ? solPrice : new Decimal(solPrice).div(priceState).toString();
  }, [isReverse, solPrice, priceState]);

  const swapInfo = useMemo(() => {
    if (!servicePoolInfo || !inputToken || !outputToken) return null;
    console.log("🚀 ~ swapInfo ~ inputToken&outputToken :", inputToken, outputToken);
    return new SwapInfo(servicePoolInfo, inputToken.address, outputToken.address, +FromUSdPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicePoolInfo, inputToken, outputToken]);

  const cleanInput = () => {
    setOrderTokenAAmount("");
    setOrderTokenBAmount("");
    setIsDisableSlippage(false);
    setRouting({
      onlySwap: "",
      dexRatio: "",
      orderRatio: "",
      buyMore: "",
      minReceive: "",
      maxReceive: "",
      fee: "",
      inputUsd: "0",
      outputUsd: "0",
      resultSlippage: "",
      resultSlippageFormatted: "",
    });
    cleanInterval();
  };

  const toggleToken = () => {
    setIsReverse((reverse) => !reverse);
    cleanInput();
  };

  const onPercentButtonClick = (percent: number) => {
    if (!publicKey) {
      setConnectWalletModalOpen(true);
      return;
    }

    if (!tokenABalance) return;

    const maxAmount = isReverse ? (solBalance ?? undefined) : tokenBalance?.amount;
    if (!maxAmount) return;

    console.log("🚀 ~ onPercentButtonClick ~ maxAmount:", maxAmount);
    // Calculate amount regardless of token direction since logic is identical
    setPercent(percent);
    const calculatedAmount = new Decimal(+maxAmount)
      .mul(new Decimal(percent))
      .div(new Decimal(100))
      .div(new Decimal(10).pow(mintDecimalA!))
      .toFixed(mintDecimalA!);
    setOrderTokenAAmount(calculatedAmount);
    setCalculatedAmount(calculatedAmount);
    console.log("🚀 ~ onPercentButtonClick ~ calculatedAmount:", calculatedAmount);
    handleQuery(calculatedAmount);
  };

  const onSlippageClick = (value: number) => {
    setSlippage(value);
    setIsDisableSlippage(false);
  };

  useEffect(() => {
    if (!orderTokenAAmount) {
      setIsQuoting(false);
      setOrderTokenBAmount("");
      return;
    }

    // handleQuery();

    // const timer = setTimeout(() => {
    //   handleQuery();
    // }, 5000);

    // return () => clearInterval(timer);
  }, [orderTokenAAmount]);

  const handleQuery = useCallback(
    debounce(async (value: string) => {
      const cantQuery = !isNumber(+value) || +value <= 0 || isQuoting || !swapInfo;
      // console.group("handleQuery");
      // console.log("cantQuery - all:", cantQuery);
      // console.log("cantQuery:", !isNumber(+orderTokenAAmount));
      // console.log("cantQuery:", +orderTokenAAmount <= 0);
      // console.log("cantQuery:", isQuoting);
      // console.log("canQuery:", !swapInfo);
      // console.groupEnd();

      if (cantQuery) {
        return;
      }

      try {
        setIsQuoting(true);

        const amount = new Decimal(value).mul(new Decimal(10).pow(mintDecimalA!)).toString();

        await swapInfo?.init_account_balance();
        const current_price = await swapInfo?.get_current_price(new BN(amount));
        // await mutateTokenBalance();

        const orderBook = await getOrderbookDepth({
          input_token: inputToken!.address,
          output_token: outputToken!.address,
          price: current_price.current_price,
        });

        swapInfo?.add_orders(orderBook);

        // const current_price = await swapInfo?.get_current_price(new BN(amount));
        const result = (await swapInfo?.calc_buy_more(new BN(amount)))!;

        const resultBuyMore = new Decimal(result.more.toString())
          .div(10 ** mintDecimalB!)
          .toString();
        const resultBuyMoreFromSwap = result.buy_more.from_swap.output.toString();

        const InputUsd = result.buy_more.result.input_usd;
        const OutputUsd = result.buy_more.result.output_usd;
        const resultSlippage = result.buy_more.result.slippage;
        const percentSlippage = new Decimal(resultSlippage).mul(100).toString();
        const percentSymbol = +InputUsd > +OutputUsd ? "-" : "+";
        const resultSlippageFormatted =
          +resultSlippage > 0 ? `(${percentSymbol}${(+percentSlippage).toFixed(2)}%)` : "";

        console.group("handleQuery");
        console.log("inputAmount", amount);
        console.log("resultBuyMore:", resultBuyMore);
        console.log("resultBuyMoreFromSwap:", resultBuyMoreFromSwap);
        console.log("current_price current_price:", current_price.current_price.toFixed(12));
        console.log("current_price input:", current_price.input.toString());
        console.log("current_price output:", current_price.output.toString());
        console.log(
          `Only swap: ${result.only_swap.input.toString()} -> ${result.only_swap.output.toString()}`
        );
        console.log(
          `Buy more: ${result.buy_more.result.input.toString()} -> ${result.buy_more.result.output.toString()}`
        );
        console.log(`Buy more input usd: ${InputUsd}`);
        console.log(`Buy more output usd: ${OutputUsd}`);
        console.log(`Buy more slippage: ${resultSlippage}, ${resultSlippageFormatted}`);
        console.log(
          `Buy more from order: ${result.buy_more.from_order.input.toString()} -> ${result.buy_more.from_order.output.toString()}`
        );
        console.log(
          `Buy more from swap: ${result.buy_more.from_swap.input.toString()} -> ${result.buy_more.from_swap.output.toString()}`
        );

        console.log("result.buy_more.result.output", result.buy_more.result.output.toString());
        console.log("result.buy_more.result.input", result.buy_more.result.input.toString());

        // Calculate the ratio between DEX and orders
        const totalOutput = new Decimal(result.buy_more.result.output.toString());
        const fromOrderOutput = new Decimal(result.buy_more.from_order.output.toString());
        const fromSwapOutput = new Decimal(result.buy_more.from_swap.output.toString());

        const orderRatio = new Decimal(fromOrderOutput).div(totalOutput).mul(100).toFixed(2);
        const swapRatio = new Decimal(100).sub(orderRatio).toFixed(2);

        // MinReceive = swapInfo.only_swap.output * slippage
        // MaxReceive = swapInfo.result.output
        // Fee = swapInfo.more * 40%

        const minReceive = new Decimal(result.only_swap.output.toString())
          .mul(new Decimal(100).sub(slippage))
          .div(100)
          .div(new Decimal(10).pow(mintDecimalB!))
          .toFixed(isReverse ? 9 : mintDecimalB!);

        const maxReceive = new Decimal(result.buy_more.result.output.toString())
          .div(new Decimal(10).pow(mintDecimalB!))
          .toFixed(isReverse ? 9 : mintDecimalB!);

        const fee = new Decimal(resultBuyMore.toString())
          .mul(0.4)
          .toFixed(isReverse ? 9 : mintDecimalB!);

        console.log("totalOutput", totalOutput.toString());
        console.log("fromOrderOutput", fromOrderOutput.toString());
        console.log("fromSwapOutput", fromSwapOutput.toString());
        // console.log("orderRatio", orderRatio.toString());
        // console.log("swapRatio", swapRatio.toString());
        console.log(`DEX ratio: ${swapRatio.toString()}%`);
        console.log(`Order ratio: ${orderRatio.toString()}%`);
        console.log(`MinReceive: ${minReceive.toString()}`);
        console.log(`MaxReceive: ${maxReceive.toString()}`);
        console.log(`Fee: ${fee.toString()}`);
        console.groupEnd();

        // let orderRatio =
        //   +totalOutput === 0
        //     ? new Decimal(0)
        //     : new Decimal(fromOrderOutput).div(totalOutput).mul(100);

        // if (orderRatio.gte(100)) {
        //   orderRatio = new Decimal(100);
        // }
        // const swapRatio = new Decimal(100).sub(orderRatio);

        const _orderTokenBAmount = new Decimal(result.buy_more.result.output.toString())
          .div(new Decimal(10).pow(mintDecimalB!))
          .toFixed(isReverse ? 9 : mintDecimalB!);

        console.log("🚀 ~ const_orderTokenBAmount:", _orderTokenBAmount);

        // debugger;
        const onlySwapOutput = new Decimal(result.only_swap.output.toString())
          .div(new Decimal(10).pow(mintDecimalB!))
          .toFixed(isReverse ? 9 : mintDecimalB!);

        setOrderTokenBAmount(_orderTokenBAmount);
        setRouting({
          onlySwap: `${formatFloor(onlySwapOutput)}`,
          dexRatio: swapRatio.toString(),
          orderRatio: orderRatio.toString(),
          buyMore: `${formatFloor(resultBuyMore)}`,
          minReceive: `${formatFloor(minReceive)}`,
          maxReceive: `${formatFloor(maxReceive)}`,
          fee: `${formatFloor(fee)}`,
          inputUsd: `${InputUsd}`,
          outputUsd: `${OutputUsd}`,
          resultSlippage: `${resultSlippage}`,
          resultSlippageFormatted: `${resultSlippageFormatted}`,
        });

        const currentSlippageValue = new Decimal(resultSlippage).mul(100).toString();

        if (+currentSlippageValue > slippage) {
          console.log("🚀 ~ handleBuy ~ slippage:", currentSlippageValue, slippage);
          setIsDisableSlippage(true);
          errorToast(
            "Slippage Failed",
            "The slippage is too low, please adjust the settings and resubmit transaction."
          );
        } else {
          setIsDisableSlippage(false);
        }
      } catch (error) {
        console.log("🚀 ~ handleOrderTokenAAmountChange ~ error:", error);
      } finally {
        setIsQuoting(false);
      }
    }, 500),
    [isQuoting, swapInfo, mintDecimalA, mintDecimalB, inputToken, outputToken, slippage, priceState]
  );

  const pollPoolInfo = async () => {
    if (inputTokenAmount && servicePoolInfo) {
      try {
        await fetchRaydiumPoolInfo(servicePoolInfo.cpmm.poolId);
        const newPrice = getCurrentPrice(raydiumPoolInfo, false);
        setPriceState(newPrice);
      } catch (error) {
        console.error("Error polling pool info:", error);
      }
    }
  };

  const cleanInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  // todo is necessary for get current price?
  useEffect(() => {
    if (inputTokenAmount && servicePoolInfo) {
      // Initial fetch
      pollPoolInfo();

      // Set up polling interval (every 30 seconds)
      const newIntervalId = setInterval(pollPoolInfo, 30000);
      setIntervalId(newIntervalId);
    }

    // Clean up interval on component unmount or when dependencies change
    return () => {
      cleanInterval();
    };
  }, [inputTokenAmount, servicePoolInfo]);

  // Add an effect to refresh the token balance when pool info changes or every 30 seconds
  useEffect(() => {
    if (raydiumPoolInfo?.poolInfo.mintB.address && publicKey) {
      mutateTokenBalance();

      // Set up a polling interval for token balance updates
      const balanceRefreshInterval = setInterval(() => {
        mutateTokenBalance();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(balanceRefreshInterval);
    }
  }, [raydiumPoolInfo?.poolInfo.mintB.address, publicKey, mutateTokenBalance]);

  const handleBuy = async () => {
    if (!inputToken || !outputToken) return;

    console.log("🚀 ~ handleBuy ~ inputAmount:", inputTokenAmount, currentAAmount);

    if (+inputTokenAmount > +currentAAmount) {
      errorToast("Swap Failed", "Insufficient balance");
      return;
    }

    // Stop polling when initiating a buy transaction
    cleanInterval();

    const amount = new Decimal(orderTokenAAmount)
      .mul(new Decimal(10).pow(mintDecimalA!))
      .toString();

    await swapInfo?.init_account_balance();
    const current_price = await swapInfo?.get_current_price(new BN(amount));

    const orderBook = await getOrderbookDepth({
      input_token: inputToken.address,
      output_token: outputToken.address,
      price: current_price!.current_price,
    });

    if (!orderBook || !raydiumPoolInfo || !servicePoolInfo) return;
    isSubmitting.on();
    swapInfo?.add_orders(orderBook);

    const slippageValue = Math.min(Math.floor(parseFloat(slippage.toString()) * 10), 1000);
    const slippageBN = new BN(slippageValue);

    console.group("handleBuy");
    console.log("🚀 ~ handleBuy ~ orderBook:", orderBook);
    console.log("orderTokenAAmount", orderTokenAAmount);
    console.log("orderTokenBAmount", orderTokenBAmount);
    console.log("inputTokenAmount", inputTokenAmount);
    console.log("outputTokenAmount", outputTokenAmount);
    console.log("slippageBN", slippageBN.toString());
    console.groupEnd();

    try {
      await swapInfo?.generate_tx(new BN(inputTokenAmount), slippageBN);
      await fetchRaydiumPoolInfo(servicePoolInfo.cpmm.poolId);
      await fetchSolBalance();
      await mutateTokenBalance();
    } catch (error) {
      console.log("🚀 ~ handleBuy ~ error:", error);
      errorToast(
        "Swap Failed",
        <>
          Request signature: <br />
          user denied request signature.
        </>
      );
    } finally {
      isSubmitting.off();
      cleanInput();
    }
  };

  const handleOrderTokenAAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    setOrderTokenAAmount(amount);
    setIsDisableSlippage(false);
    handleQuery(amount);
    if (amount === "") {
      cleanInput();
    }
  };

  // 将 ApiV3Token 或 Token 转换为 TokenSelector 需要的格式
  const convertToSelectorToken = useCallback((apiToken?: any) => {
    if (!apiToken) return null;

    return {
      id: apiToken.address || "",
      symbol: apiToken.symbol || getSymbolFromPoolInfo(apiToken) || "Unknown",
      name: apiToken.symbol || getSymbolFromPoolInfo(apiToken) || "Unknown",
      icon: apiToken.icon || "https://swap.pump.fun/tokens/sol_square.svg",
      address: apiToken.address || "",
    };
  }, []);

  return (
    <div className="p-4">
      <div className="p-4 rounded-t-lg bg-accent border border-primary shadow-md shadow-primary/20">
        <div className="flex items-center justify-between h-6">
          <span>From</span>
          {formatedTokenABalance !== undefined ? (
            <div className="flex space-x-1 items-center">
              <div className="flex items-center space-x-1">
                <Wallet className="text-muted-foreground size-3" />
                <span className="text-muted-foreground text-xs">{formatedTokenABalance}</span>
              </div>
              <Button
                size="xs"
                variant="secondary"
                className={cn(
                  "text-muted-foreground hover:text-white hover:bg-primary/80",
                  percent === 25 &&
                    calculatedAmount === orderTokenAAmount &&
                    "text-white bg-primary"
                )}
                onClick={() => onPercentButtonClick(25)}
              >
                25%
              </Button>
              <Button
                size="xs"
                variant="secondary"
                className={cn(
                  "text-muted-foreground hover:text-white hover:bg-primary/80",
                  percent === 50 &&
                    calculatedAmount === orderTokenAAmount &&
                    "text-white bg-primary"
                )}
                onClick={() => onPercentButtonClick(50)}
              >
                50%
              </Button>
              <Button
                size="xs"
                variant="secondary"
                className={cn(
                  "text-muted-foreground hover:text-white hover:bg-primary/80",
                  percent === 100 &&
                    calculatedAmount === orderTokenAAmount &&
                    "text-white bg-primary"
                )}
                onClick={() => onPercentButtonClick(100)}
              >
                100%
              </Button>
            </div>
          ) : publicKey ? (
            <Skeleton className="h-full w-24" />
          ) : null}
        </div>
        <div className="pt-3 flex ">
          {tokenA ? (
            <Button
              variant="secondary"
              className="bg-light-card/80 hover:bg-light-card/85 px-6 shadow-md"
            >
              <TokenIcon token={tokenA} size="sm" />
              {getSymbolFromPoolInfo(inputToken)}
            </Button>
          ) : (
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-2 w-18" />
            </div>
          )}
          <div className="flex flex-col items-end gap-1">
            <Input
              className="border-none text-2xl font-semibold text-right outline-none p-0 h-6"
              placeholder="0.00"
              onChange={handleOrderTokenAAmountChange}
              value={orderTokenAAmount}
            />
            <span className="text-muted-foreground text-sm flex justify-end ">
              ${formatFloor(routing.inputUsd)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center h-0 relative">
        <Button
          size="icon"
          className="rounded-full size-8 border-2 border-accent hover:text-primary text-muted-foreground relative z-10"
          variant="secondary"
          onClick={() => toggleToken()}
        >
          <ArrowDownUp className="size-4" />
        </Button>
        <div className="absolute inset-x-0 top-[50%] bg-border/60 h-[1px]" />
      </div>
      <div className="py-4 rounded-b-lg z-100 relative bg-light-card/80">
        <div className="px-4 flex items-center justify-between h-6 ">
          <span>To</span>
          {formatedTokenBBalance !== undefined ? (
            <div className="flex items-center space-x-1 ">
              <Wallet className="text-muted-foreground size-3" />
              <span className="text-muted-foreground text-xs ">{formatedTokenBBalance}</span>
            </div>
          ) : publicKey ? (
            <Skeleton className="h-full w-24" />
          ) : null}
        </div>
        <div className="py-3 px-4 flex ">
          {tokenB ? (
            <Button variant="secondary" className="bg-card/60 hover:bg-card/65 px-6 shadow-md">
              <TokenIcon token={tokenB} size="sm" />
              {getSymbolFromPoolInfo(outputToken)}
            </Button>
          ) : (
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-2 w-18" />
            </div>
          )}
          {isQuoting ? (
            <div className="flex-1 flex justify-end">
              <Skeleton className="w-32 h-8" />
            </div>
          ) : (
            <div className="flex flex-col items-end gap-1">
              <Input
                className="border-none text-2xl disabled:cursor-not-allowed font-semibold text-right outline-none p-0 h-6"
                placeholder="0.00"
                value={formatFloor(orderTokenBAmount)}
                readOnly
              />
              <span className="text-muted-foreground text-sm flex justify-end h-2">
                ${formatFloor(routing.outputUsd)} {routing.resultSlippageFormatted}
              </span>
            </div>
          )}
        </div>
      </div>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="space-y-2 border-[0.5px] border-muted-foreground/50 rounded-lg py-2 mt-3"
      >
        <OrderPanelRouting routing={routing} isQuoting={isQuoting} outputToken={outputToken} />
        <CollapsibleContent className="space-y-2">
          <OrderPanelDexComparison
            routing={routing}
            isQuoting={isQuoting}
            outputToken={outputToken}
          />
        </CollapsibleContent>

        <div className="flex items-center justify-center h-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon">
              <ChevronsUpDown isOpen={isOpen} />
            </Button>
          </CollapsibleTrigger>
        </div>
      </Collapsible>

      <div className="my-3 text-sm flex flex-col  px-4 gap-2">
        <div className="flex items-center justify-between ">
          <span className="text-white">Slippage of AMM</span>
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

        {/* <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Order</span>
          <span className="text-muted-foreground">
            {orderTokenBAmount} ({routing.orderRatio}%)
          </span>
        </div> */}
        {/* <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Limit Price</span>
          <span className="text-muted-foreground">$999.999</span>
        </div> */}
      </div>
      {publicKey ? (
        <LoadingButton
          className="w-full"
          size="lg"
          disabled={
            !orderTokenAAmount || !orderTokenBAmount || !servicePoolInfo || isDisableSlippage
          }
          onClick={handleBuy}
          loading={isSubmitting.value}
        >
          Buy
        </LoadingButton>
      ) : (
        <Button className="w-full" size="lg" onClick={() => setConnectWalletModalOpen(true)}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
}
