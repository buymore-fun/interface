import { useState } from "react";
import { useToken } from "@/hooks/use-token";
import { useTokenBalance } from "@/hooks/use-token-balance";
import { useWallet } from "@solana/wallet-adapter-react";
import { SOL_ADDRESS } from "@/lib/constants";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Icon } from "../ui/icon";
import { Skeleton } from "../ui/skeleton";
import { TokenIcon } from "../token-icon";
import { useConnectWalletModalOpen } from "@/hooks/use-connect-wallet-modal";
import { OrderType } from "@/consts/order";
import { usePoolPrepareId } from "@/hooks/services";
import { useParams } from "next/navigation";
import Image from "next/image";
import WalletIcon from "@/public/assets/token/wallet.svg";
import { useMemo } from "react";
import { useSolBalance, useTokenBalanceV2 } from "@/hooks/use-sol-balance";
import { usePoolInfo } from "@/hooks/use-pool-info";
interface OrderTabProps {
  poolId: string;
}

export function OrderTab({ poolId: tokenAddress }: OrderTabProps) {
  const { address } = useParams();
  const [, setConnectWalletModalOpen] = useConnectWalletModalOpen();

  const { poolInfo, isLoading, error } = usePoolInfo();

  const token = useToken(tokenAddress);
  const SOL = useToken(SOL_ADDRESS);

  const { solBalance } = useSolBalance();
  const { tokenBalance } = useTokenBalanceV2(poolInfo?.poolInfo.mintB.address);
  console.log("🚀 ~ OrderTab ~ tokenBalance:", tokenBalance);
  console.log("🚀 ~ OrderTab ~ poolInfo:", poolInfo);

  const { publicKey } = useWallet();
  const [orderType, setOrderType] = useState<OrderType>(OrderType.Buy);
  const [orderTokenAAmount, setOrderTokenAAmount] = useState("");
  const [orderTokenBAmount, setOrderTokenBAmount] = useState("");

  const isBuy = orderType === OrderType.Buy;

  const [orderTokenA, orderTokenB] = useMemo(
    () => (isBuy ? [SOL, token] : [token, SOL]),
    [isBuy, token, SOL]
  );

  const [orderTokenABalance, orderTokenBBalance] = useMemo(
    () =>
      isBuy ? [solBalance ?? undefined, tokenBalance] : [tokenBalance, solBalance ?? undefined],
    [isBuy, tokenBalance, solBalance]
  );

  const { mutate: mutatePoolId } = usePoolPrepareId({
    token: address as string,
    order_type: orderType,
  });

  const toggleOrderType = () => {
    setOrderType(isBuy ? OrderType.Sell : OrderType.Buy);
  };

  const refreshTokenPrice = () => {
    console.log("refresh token price");
  };

  const handleSubmitOrder = async () => {
    try {
      const poolIdData = await mutatePoolId();
      if (!poolIdData?.pool_id) {
        console.error("Failed to get pool ID");
        return;
      }
      console.log("Got pool ID:", poolIdData.pool_id);
      // Continue with your order submission logic here
    } catch (error) {
      console.error("Error preparing pool ID:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-muted-foreground">
          Order type: {isBuy ? "Buying" : "Selling"}
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1 ">
          <Image src={WalletIcon} alt="Wallet" />
          <span>
            {isBuy
              ? `${orderTokenABalance} ${orderTokenA?.symbol}`
              : `${orderTokenBBalance} ${orderTokenB?.symbol}`}
          </span>
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
              <Button
                variant="ghost"
                size="xs"
                className="p-0 h-auto"
                onClick={() => {
                  refreshTokenPrice();
                }}
              >
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
            {orderTokenA ? (
              <Button variant="ghost" className="px-0">
                <TokenIcon token={orderTokenA} size="sm" />
                {orderTokenA.symbol}
              </Button>
            ) : (
              <Skeleton className="h-9 w-24" />
            )}
            <Input
              className="border-none text-lg font-semibold text-right outline-none p-0"
              placeholder="0.00"
              value={orderTokenAAmount}
              onChange={(e) => setOrderTokenAAmount(e.target.value)}
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toggleOrderType();
            }}
          >
            <Icon name="switch" className="text-primary" />
          </Button>

          <div className="flex items-center gap-2 bg-light-card/70 p-2 rounded-lg h-[60px]">
            {orderTokenB ? (
              <Button variant="ghost" className="px-0">
                <TokenIcon token={orderTokenB} size="sm" />
                {orderTokenB.symbol}
              </Button>
            ) : (
              <Skeleton className="h-9 w-24" />
            )}
            <Input
              className="border-none text-lg font-semibold text-right outline-none p-0 disabled:cursor-not-allowed"
              placeholder="0.00"
              value={orderTokenBAmount}
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
          <Button
            className="w-full"
            size="lg"
            disabled={!orderTokenAAmount}
            onClick={handleSubmitOrder}
          >
            Submit
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
