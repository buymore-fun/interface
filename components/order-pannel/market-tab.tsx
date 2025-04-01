import { useEffect, useMemo, useState } from "react";
import { ArrowDownUp, Wallet } from "lucide-react";
import { SOL_ADDRESS } from "@/lib/constants";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { TokenIcon } from "../token-icon";
import { useWallet } from "@solana/wallet-adapter-react";
import { formatNumber } from "@/lib/utils";
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

interface MarketTabProps {
  tokenAddress: string;
  setSlippageDialogOpen: (open: boolean) => void;
}

export function MarketTab({ tokenAddress, setSlippageDialogOpen }: MarketTabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [slippage, setSlippage] = useAtom(slippageAtom);
  const [, setConnectWalletModalOpen] = useConnectWalletModalOpen();

  const token = useToken(tokenAddress);
  const SOL = useToken(SOL_ADDRESS);

  const SOLBalance = useTokenBalance(SOL);
  const tokenBalance = useTokenBalance(token);

  const [tokenAAmount, setTokenAAmount] = useState("");
  const [tokenBAmount, setTokenBAmount] = useState("");

  const { publicKey } = useWallet();
  const [isQuoting, setIsQuoting] = useState(false);
  const [isReverse, setIsReverse] = useState(false);

  const [tokenA, tokenB] = useMemo(
    () => (isReverse ? [SOL, token] : [token, SOL]),
    [isReverse, token, SOL]
  );

  const [tokenABalance, tokenBBalance] = useMemo(
    () => (isReverse ? [SOLBalance, tokenBalance] : [tokenBalance, SOLBalance]),
    [isReverse, tokenBalance, SOLBalance]
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

    const maxAmount = isReverse ? SOLBalance : tokenBalance;
    if (!maxAmount) return;

    const calculatedAmount = (+maxAmount * percent) / 100;
    setTokenAAmount(calculatedAmount.toString());
  };

  const onSlippageClick = (value: number) => {
    setSlippage(value);
  };

  useEffect(() => {
    if (!tokenAAmount) {
      setIsQuoting(false);
      setTokenBAmount("");
      return;
    }
    setIsQuoting(true);
    setTimeout(() => {
      setTokenBAmount("0.01");
      setIsQuoting(false);
    }, 2000);
  }, [tokenAAmount]);

  return (
    <div className="p-4">
      <div className="p-4 rounded-t-lg bg-accent">
        <div className="flex items-center justify-between h-6">
          <span className="text-sm">Selling</span>
          {tokenABalance !== undefined ? (
            <div className="flex space-x-2 items-center">
              <div className="flex items-center space-x-1">
                <Wallet className="text-muted-foreground size-3" />
                <span className="text-muted-foreground text-xs">{formatNumber(tokenABalance)}</span>
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
            onChange={(e) => setTokenAAmount(e.target.value)}
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
              value={tokenBAmount}
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
        <Button className="w-full" size="lg" disabled={!tokenAAmount || !tokenBAmount}>
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
