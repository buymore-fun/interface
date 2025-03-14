import { useToken } from "@/hooks/use-token";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { SOL_ADDRESS } from "@/lib/constants";
import { Skeleton } from "./ui/skeleton";
import { TokenIcon } from "./token-icon";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTokenBalance } from "@/hooks/use-token-balance";
import { formatNumber } from "@/lib/utils";
import { Wallet } from "lucide-react";
import { useConnectWalletModalOpen } from "@/hooks/use-connect-wallet-modal";

export function OrderPanel({ tokenAddress }: { tokenAddress: string }) {
  const token = useToken(tokenAddress);
  console.log("🚀 ~ OrderPanel ~ token:", token);
  const SOL = useToken(SOL_ADDRESS);
  console.log("🚀 ~ OrderPanel ~ SOL:", SOL);
  const [, setConnectWalletModalOpen] = useConnectWalletModalOpen();

  const SOLBalance = useTokenBalance(SOL);
  console.log("🚀 ~ OrderPanel ~ SOLBalance:", SOLBalance);
  const tokenBalance = useTokenBalance(token);
  console.log("🚀 ~ OrderPanel ~ tokenBalance:", tokenBalance);
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
                  className="text-muted-foreground"
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
        <div className="p-4 rounded-b-lg bg-light-card/70">
          <div className="flex items-center justify-between h-6">
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
          <div className="mt-2 flex">
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
        </div>
        <div className="my-3 text-sm flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Slippage</span>
            <span>-</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Smart ordering</span>
            <span>-</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Buy more</span>
            <span>-</span>
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
    </div>
  );
}
