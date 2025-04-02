import { useState } from "react";
import { useToken } from "@/hooks/use-token";
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
import { useMemo, useEffect } from "react";
import { useSolBalance, useTokenBalanceV2 } from "@/hooks/use-sol-balance";
import { usePoolInfo } from "@/hooks/use-pool-info";
import Decimal from "decimal.js";
import { formatNumber, formatSolBalance } from "@/lib/utils";
import { useHybirdTradeProgram } from "@/hooks/hybird-trade/hybird-trade-data-access";
import { BN } from "@coral-xyz/anchor";
import { useSolPrice } from "@/hooks/use-sol-price";
interface OrderTabProps {
  poolId: string;
}

export function OrderTab({ poolId }: OrderTabProps) {
  const [, setConnectWalletModalOpen] = useConnectWalletModalOpen();
  const [price, setPrice] = useState<string>("");
  const { solPrice } = useSolPrice();

  const { poolInfo, isLoading: isPoolLoading, fetchPoolInfo } = usePoolInfo(poolId);
  // console.log(new Decimal("549851188.5306576").div(new Decimal("0.036867143")).toString());

  const token = useToken(poolId);
  const SOL = useToken(SOL_ADDRESS);

  const { solBalance } = useSolBalance();
  const { tokenBalance } = useTokenBalanceV2(poolInfo?.poolInfo.mintB.address);

  // const hybirdTradeProgram = useHybirdTradeProgram("");

  const { publicKey } = useWallet();
  const [orderType, setOrderType] = useState<OrderType>(OrderType.Buy);
  const [orderTokenAAmount, setOrderTokenAAmount] = useState("");
  const [orderTokenBAmount, setOrderTokenBAmount] = useState("");

  const isBuy = orderType === OrderType.Buy;

  const [tokenA, tokenB] = useMemo(
    () => (isBuy ? [SOL, token] : [token, SOL]),
    [isBuy, token, SOL]
  );

  const [mintA, mintB] = useMemo(
    () =>
      isBuy
        ? [poolInfo?.poolInfo.mintA, poolInfo?.poolInfo.mintB]
        : [poolInfo?.poolInfo.mintB, poolInfo?.poolInfo.mintA],
    [isBuy, poolInfo]
  );

  const [tokenABalance, tokenBBalance] = useMemo(
    () =>
      isBuy ? [solBalance, tokenBalance?.amount || 0] : [tokenBalance?.amount || 0, solBalance],
    [isBuy, tokenBalance, solBalance]
  );

  const { mutate: mutatePoolId } = usePoolPrepareId({
    token: poolId,
    order_type: orderType,
  });

  // Update price when poolInfo changes
  useEffect(() => {
    if (poolInfo?.poolInfo.price) {
      setPrice(poolInfo.poolInfo.price.toString());
    }
  }, [poolInfo]);

  const toggleOrderType = () => {
    setOrderType(isBuy ? OrderType.Sell : OrderType.Buy);
  };

  const refreshTokenPrice = () => {
    if (isPoolLoading) return;
    fetchPoolInfo();
  };

  const handleSubmitOrder = async () => {
    try {
      const poolIdData = await mutatePoolId();
      if (!poolIdData?.pool_id) {
        console.error("Failed to get pool ID");
        return;
      }

      // try {
      //   await hybirdTradeProgram.addOrder(
      //     // new BN(Number(inAmount) * 10000),
      //     // new BN(Number(outAmount) * 1000),
      //     new BN(10000),
      //     new BN(1000),
      //     orderType,
      //     new BN(poolIdData.pool_id)
      //   );
      // } catch (error) {
      //   console.error("Failed to add order:", error);
      // }

      console.log("Got pool ID:", poolIdData.pool_id);
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
              ? `${formatSolBalance(solBalance)} SOL`
              : `${tokenBalance?.uiAmountString} ${poolInfo?.poolInfo.mintB?.symbol}`}
          </span>
        </div>
      </div>

      <div className="p-4 bg-accent border border-primary rounded-lg ">
        <div className="flex items-center justify-between bg-light-card/70 p-2 rounded-lg h-[60px]">
          <div className="flex items-center gap-2 ">
            <Image src="/assets/token/price.svg" width={28} height={28} alt="Price" />
            <div className="flex flex-col">
              <span>Price</span>
              <span className="text-xs text-muted-foreground">
                {tokenA?.symbol}/{tokenB?.symbol}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <Input
                className="border-none text-lg font-semibold text-right outline-none p-0 w-[180px]"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <Button variant="ghost" size="xs" className="p-0 h-auto" onClick={refreshTokenPrice}>
                <Icon name="refresh" className="text-primary" />
              </Button>
            </div>
            <div className="flex items-start text-xs text-muted-foreground w-full justify-end">
              {isPoolLoading ? (
                <Skeleton className="w-16 h-4" />
              ) : (
                <span>≈${poolInfo?.poolInfo.price}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between py-3  gap-2">
          <div className="flex items-center gap-2 bg-light-card/70 p-2 rounded-lg h-[60px] w-[180px]">
            {tokenA ? (
              <Button variant="ghost" className="px-0">
                <TokenIcon token={tokenA} size="sm" />
                {tokenA.symbol}
              </Button>
            ) : (
              <Skeleton className="h-9 w-24" />
            )}
            <Input
              className="border-none text-lg font-semibold text-right outline-none p-0 "
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

          <div className="flex items-center gap-2 bg-light-card/70 p-2 rounded-lg h-[60px] w-[180px]">
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
            disabled={!orderTokenAAmount || isPoolLoading}
            onClick={handleSubmitOrder}
          >
            {/* {isPoolLoading ? <Spinner size="small" /> : "Submit"} */}
            {"Submit"}
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
