import { useToken } from "@/hooks/use-token";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { SOL_ADDRESS } from "@/lib/constants";
import { Skeleton } from "../ui/skeleton";
import { TokenIcon } from "../token-icon";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTokenBalance } from "@/hooks/use-token-balance";
import { formatNumber } from "@/lib/utils";
import { Wallet } from "lucide-react";
import { useConnectWalletModalOpen } from "@/hooks/use-connect-wallet-modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import Market from "@/public/assets/token/market.svg";
import Order from "@/public/assets/token/order.svg";
import WalletIcon from "@/public/assets/token/wallet.svg";
import Image from "next/image";
import { Icon, ChevronsUpDown } from "../ui/icon";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";
import { Separator } from "@/components/ui/separator";
import TooltipWrapper from "@/components/tooltip-wrapper";
import { OrderPanelDexComparison } from "@/components/order-pannel/order-panel-dex-comparison";
import { OrderPanelRouting } from "@/components/order-pannel/order-panel-routing";
import { SlippageDialog } from "@/components/slippage-dialog";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

const slippageAtom = atomWithStorage("slippage", 5);

enum Tab {
  MARKET = "market",
  ORDER = "order",
}

export function OrderPanel({ tokenAddress }: { tokenAddress: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [slippage, setSlippage] = useAtom(slippageAtom);

  const [slippageDialogOpen, setSlippageDialogOpen] = useState(false);

  const [tab, setTab] = useState<Tab>(Tab.MARKET);
  // const [tab, setTab] = useState<Tab>(Tab.ORDER);

  const token = useToken(tokenAddress);
  // console.log("🚀 ~ OrderPanel ~ token:", token);
  const SOL = useToken(SOL_ADDRESS);
  // console.log("🚀 ~ OrderPanel ~ SOL:", SOL);
  const [, setConnectWalletModalOpen] = useConnectWalletModalOpen();

  const SOLBalance = useTokenBalance(SOL);
  // console.log("🚀 ~ OrderPanel ~ SOLBalance:", SOLBalance);
  const tokenBalance = useTokenBalance(token);
  // console.log("🚀 ~ OrderPanel ~ tokenBalance:", tokenBalance);

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
    <div className="bg-card rounded-lg overflow-hidden">
      {/* <div className="flex text-lg font-semibold">
        <div className="flex-1 h-11 flex items-center justify-center cursor-pointer">
          <span>Market</span>
        </div>
        <div className="flex-1 h-11 flex items-center justify-center text-muted-foreground bg-accent cursor-pointer">
          <span>Order</span>
        </div>
      </div> */}

      <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
        <TabsList className="w-full grid grid-cols-2 h-11 text-lg font-semibold">
          <TabsTrigger
            value={Tab.MARKET}
            className={`rounded-none ${tab === Tab.MARKET ? "bg-transparent text-foreground" : "bg-accent text-muted-foreground"}`}
          >
            <div className="flex items-center gap-2 justify-center">
              <Image src={Market} alt="Market" className="size-4" />
              Market
            </div>
          </TabsTrigger>
          <TabsTrigger
            value={Tab.ORDER}
            className={`rounded-none ${tab === Tab.ORDER ? "bg-transparent text-foreground" : "bg-accent text-muted-foreground"}`}
          >
            <div className="flex items-center gap-2 justify-center">
              <Image src={Order} alt="Order" className="size-4" />
              Order
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value={Tab.MARKET}>
          {/* Market content will go here */}
          <div className="p-4">
            <div className="p-4 rounded-t-lg bg-accent">
              <div className="flex items-center justify-between h-6">
                <span className="text-sm">Selling</span>
                {tokenABalance !== undefined ? (
                  <div className="flex space-x-2 items-center">
                    <div className="flex items-center space-x-1">
                      <Wallet className="text-muted-foreground size-3" />
                      <span className="text-muted-foreground text-xs">
                        {formatNumber(tokenABalance)}
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
                  <Button
                    variant="secondary"
                    className="bg-secondary/60 hvoer:bg-secondary/60 px-2"
                  >
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
              {/* <div className="p-4 rounded-b-lg bg-light-card/70 "> */}
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
                    <Button
                      size="xs"
                      variant="secondary"
                      className="text-muted-foreground "
                      onClick={() => onPercentButtonClick(25)}
                    >
                      1%
                    </Button>
                    <Button
                      size="xs"
                      variant="secondary"
                      className="text-muted-foreground"
                      onClick={() => onPercentButtonClick(50)}
                    >
                      5%
                    </Button>
                    <Button
                      size="xs"
                      variant="secondary"
                      className="text-muted-foreground"
                      onClick={() => onPercentButtonClick(100)}
                    >
                      10%
                    </Button>
                    <Button
                      size="xs"
                      variant="secondary"
                      className="text-muted-foreground"
                      onClick={() => setSlippageDialogOpen(true)}
                    >
                      Custom
                    </Button>
                  </div>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Smart ordering</span>
                <span>-</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-primary-highlight">Buymore</span>
                <span className="text-primary/80">≈+9.999 $USDC</span>
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
        </TabsContent>

        <TabsContent value={Tab.ORDER}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-muted-foreground">Order type: Buying</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1 ">
                <Image src={WalletIcon} alt="Wallet" />
                <span>999,999 SOL</span>
              </div>
            </div>

            <div className="p-4 bg-accent border border-primary rounded-lg ">
              <div className="flex items-center justify-between bg-light-card/70 p-2 rounded-lg h-[60px]">
                <div className="flex items-center gap-2 ">
                  <Image src="/assets/token/price.svg" width={28} height={28} alt="Price" />
                  <div className="flex flex-col">
                    <span>Price</span>
                    <span className="text-xs text-muted-foreground">BOB/SOL</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    <span>499.500</span>
                    <Button variant="ghost" size="xs" className="p-0 h-auto">
                      <Icon name="refresh" className="text-primary" />
                    </Button>
                  </div>
                  <div className="flex items-start text-xs text-muted-foreground w-full">
                    <span>≈$0.00345</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-3  gap-2">
                <div className="flex items-center gap-2 bg-light-card/70 p-2 rounded-lg h-[60px]">
                  {tokenA ? (
                    <Button variant="ghost" className="px-0">
                      <TokenIcon token={tokenA} size="sm" />
                      {tokenA.symbol}
                    </Button>
                  ) : (
                    <Skeleton className="h-9 w-24" />
                  )}
                  <Input
                    className="border-none text-lg font-semibold text-right outline-none p-0"
                    placeholder="0.00"
                    value={tokenAAmount}
                    onChange={(e) => setTokenAAmount(e.target.value)}
                  />
                </div>

                <Button variant="ghost" size="icon">
                  <Icon name="switch" className="text-primary" />
                </Button>

                <div className="flex items-center gap-2 bg-light-card/70 p-2 rounded-lg h-[60px]">
                  {tokenB ? (
                    <Button variant="ghost" className="px-0">
                      <TokenIcon token={tokenB} size="sm" />
                      {tokenB.symbol}
                    </Button>
                  ) : (
                    <Skeleton className="h-9 w-24" />
                  )}
                  <Input
                    className="border-none text-lg font-semibold text-right outline-none p-0 disabled:cursor-not-allowed"
                    placeholder="0.00"
                    value={tokenBAmount}
                    disabled={true}
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm text-muted-foreground text-right">
              Fee: 0% (<span className="line-through">0.25%</span>)
            </div>

            <div className="mt-3">
              {publicKey ? (
                <Button className="w-full" size="lg" disabled={!tokenAAmount}>
                  Submit
                </Button>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setConnectWalletModalOpen(true)}
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <SlippageDialog
        onSlippageChange={setSlippage}
        open={slippageDialogOpen}
        onOpenChange={setSlippageDialogOpen}
      />
    </div>
  );
}
