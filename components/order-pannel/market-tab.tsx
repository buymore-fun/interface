import { useEffect, useMemo, useState, useCallback } from "react";
import { ArrowDownUp, Wallet } from "lucide-react";
import { SOL_ADDRESS } from "@/lib/constants";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { TokenIcon } from "../token-icon";
import { useWallet } from "@solana/wallet-adapter-react";
import { formatBalance, formatNumber } from "@/lib/utils";
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
import { useSolBalance } from "@/hooks/use-sol-balance";
import { useHybirdTradeProgram } from "@/hooks/hybird-trade/hybird-trade-data-access";
import { getOrderbookDepth } from "@/hooks/services";
import { debounce } from "lodash";

import Decimal from "decimal.js";
import { BN } from "@coral-xyz/anchor";
import { isNumber } from "@raydium-io/raydium-sdk-v2";
import useBoolean from "@/hooks/use-boolean";
import { LoadingButton } from "@/components/ui/loading-button";
import { useRaydiumPoolInfo, useServicePoolInfo } from "@/hooks/use-pool-info";
import { getSymbolFromPoolInfo } from "@/lib/calc";

interface MarketTabProps {
  setSlippageDialogOpen: (open: boolean) => void;
}

export interface Routing {
  dexRatio: string;
  orderRatio: string;
  buyMore: string;
  onlySwap: string;
}

export function MarketTab({ setSlippageDialogOpen }: MarketTabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [slippage, setSlippage] = useAtom(slippageAtom);
  const [, setConnectWalletModalOpen] = useConnectWalletModalOpen();

  const { servicePoolInfo } = useServicePoolInfo();
  const { raydiumPoolInfo } = useRaydiumPoolInfo();

  const token = useToken(servicePoolInfo!.cpmm.mintB);
  const SOL = useToken(SOL_ADDRESS);
  const isSubmitting = useBoolean();

  const { solBalance, fetchSolBalance, isLoading } = useSolBalance();
  const tokenBalance = useTokenBalance(token);

  const [orderTokenAAmount, setOrderTokenAAmount] = useState("");
  const [orderTokenBAmount, setOrderTokenBAmount] = useState("");

  const { publicKey } = useWallet();
  const [isQuoting, setIsQuoting] = useState(false);
  const [isReverse, setIsReverse] = useState(true);

  const [routing, setRouting] = useState<Routing>({
    onlySwap: "",
    dexRatio: "",
    orderRatio: "",
    buyMore: "",
  });

  const [tokenA, tokenB] = useMemo(
    () => (isReverse ? [SOL, token] : [token, SOL]),
    [isReverse, token, SOL]
  );

  const [inputToken, outputToken] = useMemo(
    () =>
      isReverse
        ? [raydiumPoolInfo?.poolInfo.mintA, raydiumPoolInfo?.poolInfo.mintB]
        : [raydiumPoolInfo?.poolInfo.mintB, raydiumPoolInfo?.poolInfo.mintA],
    [isReverse, raydiumPoolInfo]
  );

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
      isReverse ? [solBalance ?? undefined, tokenBalance] : [tokenBalance, solBalance ?? undefined],
    [isReverse, tokenBalance, solBalance]
  );

  const toggleToken = () => {
    setIsReverse((reverse) => !reverse);
    setOrderTokenAAmount("");
    setOrderTokenBAmount("");
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

  const hybirdTradeProgram = useHybirdTradeProgram();
  const { SwapInfo } = hybirdTradeProgram;

  const swapInfo = useMemo(() => {
    if (!servicePoolInfo || !inputToken || !outputToken) return null;
    return new SwapInfo(servicePoolInfo, inputToken.address, outputToken.address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicePoolInfo, inputToken, outputToken]);

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

        console.log("totalOutput", totalOutput.toString());
        console.log("fromOrderOutput", fromOrderOutput.toString());
        console.log("fromSwapOutput", fromSwapOutput.toString());
        // console.log("orderRatio", orderRatio.toString());
        // console.log("swapRatio", swapRatio.toString());
        console.log(`DEX ratio: ${swapRatio.toString()}%`);
        console.log(`Order ratio: ${orderRatio.toString()}%`);
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
          .toFixed(2);

        // debugger;
        const onlySwapOutput = new Decimal(result.only_swap.output.toString())
          .div(new Decimal(10).pow(mintDecimalB!))
          .toFixed(2);

        setOrderTokenBAmount(_orderTokenBAmount);
        setRouting({
          onlySwap: `${onlySwapOutput} $${outputToken?.symbol || ""}`,
          dexRatio: swapRatio.toString(),
          orderRatio: orderRatio.toString(),
          buyMore: `${resultBuyMore} $${outputToken?.symbol || ""}`,
        });
      } catch (error) {
        console.log("🚀 ~ handleOrderTokenAAmountChange ~ error:", error);
      } finally {
        setIsQuoting(false);
      }
    }, 500),
    [isQuoting, swapInfo, mintDecimalA, mintDecimalB, inputToken, outputToken]
  );

  const handleBuy = async () => {
    if (!inputToken || !outputToken) return;

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
    } catch (error) {
      console.log("🚀 ~ handleBuy ~ error:", error);
    } finally {
      isSubmitting.off();
    }
  };

  const handleOrderTokenAAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    setOrderTokenAAmount(amount);
    handleQuery(amount);
  };

  return (
    <div className="p-4">
      <div className="p-4 rounded-t-lg bg-accent border border-primary shadow-md shadow-primary/20">
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
        <div className="mt-2 flex ">
          {tokenA ? (
            <Button variant="secondary" className="bg-secondary/60 hvoer:bg-secondary/60 px-2">
              <TokenIcon token={tokenA} size="sm" />
              {inputToken?.symbol}
            </Button>
          ) : (
            <Skeleton className="h-9 w-24" />
          )}
          <Input
            className="border-none text-lg font-semibold text-right outline-none p-0"
            placeholder="0.00"
            onChange={handleOrderTokenAAmountChange}
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
      <div className="py-4 rounded-b-lg z-100 relative bg-[#2E3C4E]/80">
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
      </div>

      <div className="border-[0.5px] border-[#797979] rounded-lg py-2 mt-3">
        <OrderPanelRouting routing={routing} isQuoting={isQuoting} outputToken={outputToken} />
        <OrderPanelDexComparison
          routing={routing}
          isQuoting={isQuoting}
          outputToken={outputToken}
          fee={new Decimal(orderTokenBAmount || "0").mul(0.4).toFixed(2)}
        />
      </div>
      <div className="my-3 text-sm flex flex-col  px-4 gap-2">
        <div className="flex items-center justify-between ">
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
        <div className="flex items-center justify-between">
          <span className="">Min Receive</span>
          <span className="text-muted-foreground">
            {orderTokenBAmount
              ? new Decimal(orderTokenBAmount)
                  .mul(new Decimal(100).sub(slippage))
                  .div(100)
                  .toString()
              : "--"}{" "}
            ${getSymbolFromPoolInfo(outputToken)}
          </span>
        </div>
      </div>
      {publicKey ? (
        <LoadingButton
          className="w-full"
          size="lg"
          disabled={!orderTokenAAmount || !orderTokenBAmount || !servicePoolInfo}
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
