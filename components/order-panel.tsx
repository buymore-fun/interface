import { useToken } from "@/hooks/use-token";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useMemo, useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { SOL_ADDRESS } from "@/lib/constants";
import { Skeleton } from "./ui/skeleton";
import { TokenIcon } from "./token-icon";

export function OrderPanel({ tokenAddress }: { tokenAddress: string }) {
  const token = useToken(tokenAddress);
  const SOL = useToken(SOL_ADDRESS);

  const [isReverse, setIsReverse] = useState(false);

  const [tokenA, tokenB] = useMemo(
    () => (isReverse ? [SOL, token] : [token, SOL]),
    [isReverse, token, SOL]
  );

  const toggleToken = () => {
    setIsReverse((reverse) => !reverse);
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden">
      <div className="flex text-lg font-semibold">
        <div className="flex-1 h-11 flex items-center justify-center cursor-pointer">
          <span>Market</span>
        </div>
        <div className="flex-1 h-11 flex items-center justify-center text-muted-foreground bg-accent cursor-pointer">
          <span>Order</span>
        </div>
      </div>
      <div className="p-4">
        <div className="p-4 rounded-t-lg bg-accent">
          <div className="flex items-center justify-between">
            <span className="text-sm">Selling</span>
            <div className="flex space-x-2">
              <Button
                size="xs"
                variant="secondary"
                className="text-muted-foreground"
              >
                25%
              </Button>
              <Button
                size="xs"
                variant="secondary"
                className="text-muted-foreground"
              >
                50%
              </Button>
              <Button
                size="xs"
                variant="secondary"
                className="text-muted-foreground"
              >
                100%
              </Button>
            </div>
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
        <div className="p-4 rounded-b-lg bg-light-card/70">
          <div className="flex items-center justify-between">
            <span className="text-sm">Buying</span>
            <div className="flex space-x-2"></div>
          </div>
          <div className="mt-2 flex">
            {tokenB ? (
              <Button
                variant="secondary"
                className="bg-light-card hover:bg-light-card px-2"
              >
                <TokenIcon token={tokenB} size="sm" />
                {tokenB.symbol}
              </Button>
            ) : (
              <Skeleton className="h-9 w-24" />
            )}
            <Input
              className="border-none text-lg font-semibold text-right outline-none p-0"
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="my-3 text-sm flex flex-col gap-1">
          <div className="flex items-center">
            <span>Slippage</span>
          </div>
          <div className="flex items-center">
            <span>Smart Ordering</span>
          </div>
          <div className="flex items-center">
            <span>Buy More</span>
          </div>
        </div>
        <Button className="w-full" size="lg">
          Buy
        </Button>
      </div>
    </div>
  );
}
