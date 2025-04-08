import { use, useCallback, useState } from "react";
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
import { useCpmmPoolFetchAll, useCpmmPoolFetchOne, usePoolPrepareId } from "@/hooks/services";
import { useParams } from "next/navigation";
import Image from "next/image";
import WalletIcon from "@/public/assets/token/wallet.svg";
import { useMemo, useEffect } from "react";
import { useSolBalance, useTokenBalanceV2 } from "@/hooks/use-sol-balance";
import { usePoolInfo } from "@/hooks/use-pool-info";
import Decimal from "decimal.js";
import { formatNumber, formatBalance } from "@/lib/utils";
import { useHybirdTradeProgram } from "@/hooks/hybird-trade/hybird-trade-data-access";
import { BN } from "@coral-xyz/anchor";
import { useSolPrice } from "@/hooks/use-sol-price";
import { CpmmPoolInfo } from "@/types/raydium";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { IResponsePoolInfoItem } from "@/types/response";
import { LoadingButton } from "@/components/ui/loading-button";
import { useBoolean } from "@/hooks/use-boolean";
import { getCurrentPrice } from "@/lib/calc";

interface OrderTabProps {
  poolId: string;
}

export function OrderTab({ poolId }: OrderTabProps) {
  const [, setConnectWalletModalOpen] = useConnectWalletModalOpen();
  const [orderPrice, setOrderPrice] = useState<string>("");
  const { solPrice, isLoading: isSolPriceLoading } = useSolPrice();

  const { poolInfo, isLoading: isPoolLoading, fetchPoolInfo } = usePoolInfo(poolId);

  const submitOrderLoading = useBoolean(false);

  const { data: poolInfoData, isLoading: isPoolInfoLoading } = useCpmmPoolFetchOne({
    pool_id: poolId,
  });

  const isLoading = isSolPriceLoading || isPoolLoading || isPoolInfoLoading;

  const token = useToken(poolId);
  const SOL = useToken(SOL_ADDRESS);

  const { solBalance } = useSolBalance();
  const { tokenBalance } = useTokenBalanceV2(poolInfo?.poolInfo.mintB.address);

  const hybirdTradeProgram = useHybirdTradeProgram("");

  const { publicKey } = useWallet();
  const [orderType, setOrderType] = useState<OrderType>(OrderType.Buy);
  const [orderTokenAAmount, setOrderTokenAAmount] = useState("");
  const [orderTokenBAmount, setOrderTokenBAmount] = useState("");

  // TO BUY SHIT COIN
  const isBuy = orderType === OrderType.Buy;

  const [tokenA, tokenB] = useMemo(
    () => (isBuy ? [SOL, token] : [token, SOL]),
    [isBuy, token, SOL]
  );

  const [poolMintA, poolMintB] = useMemo(
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
    input_token: poolMintA?.address || "",
    output_token: poolMintB?.address || "",
  });

  const getCurrentPriceInUSD = (cpmmPoolInfo?: CpmmPoolInfo, isReverse = true) => {
    const price = getCurrentPrice(cpmmPoolInfo, isReverse);
    const priceInUSD = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 9,
    }).format(price * solPrice);

    return priceInUSD;
  };

  useEffect(() => {
    if (poolInfo?.poolInfo) {
      const price = getCurrentPrice(poolInfo, false);
      setOrderPrice(price.toString());
    }
  }, [poolInfo]);

  useEffect(() => {
    if (orderTokenAAmount && orderPrice) {
      if (isBuy) {
        const _orderTokenBAmount = new Decimal(orderTokenAAmount)
          .mul(new Decimal(orderPrice))
          .toString();

        setOrderTokenBAmount(_orderTokenBAmount);
      } else {
        const _orderTokenBAmount = new Decimal(orderTokenAAmount)
          .div(new Decimal(orderPrice))
          .toString();

        setOrderTokenBAmount(_orderTokenBAmount);
      }
    }
  }, [orderTokenAAmount, orderPrice, setOrderTokenBAmount, isBuy]);

  const toggleOrderType = () => {
    setOrderType(isBuy ? OrderType.Sell : OrderType.Buy);
    setOrderTokenAAmount("");
  };

  const refreshTokenPrice = () => {
    if (isPoolLoading) return;
    fetchPoolInfo();
  };

  const handleSubmitOrder = async () => {
    try {
      submitOrderLoading.setTrue();
      const poolIdData = await mutatePoolId();
      if (!poolIdData?.pool_id || !poolInfo || !poolInfoData) {
        console.error("Failed to get pool ID");
        return;
      }

      // const [mintDecimalA, mintDecimalB] = isBuy
      //   ? [poolMint!.decimals, poolMintB!.decimals]
      //   : [poolMintB!.decimals, poolMintA!.decimals];
      const [mintDecimalA, mintDecimalB] = [poolMintA!.decimals, poolMintB!.decimals];

      const inAmount = new Decimal(orderTokenAAmount)
        .mul(new Decimal(10).pow(mintDecimalA))
        .floor()
        .toString();

      const outAmount = new Decimal(orderTokenBAmount)
        .mul(new Decimal(10).pow(mintDecimalB))
        .floor()
        .toString();

      await hybirdTradeProgram.initialize_pool(poolIdData.pool_id, poolInfoData!);

      const [inputTokenMint, outputTokenMint] = [poolMintA!.address, poolMintB!.address];

      console.group("handleSubmitOrder");
      console.log("inputTokenMint", inputTokenMint);
      console.log("outputTokenMint", outputTokenMint);
      console.log("poolInfoData", poolInfoData);
      console.log("poolInfo", poolInfo);
      console.log("orderPrice", orderPrice);
      console.log("getCurrentPrice", getCurrentPrice(poolInfo));
      console.log("getCurrentPriceInUSD", getCurrentPriceInUSD(poolInfo));
      console.log("Got pool ID", poolIdData.pool_id);
      console.log(`orderTokenAAmount`, orderTokenAAmount);
      console.log(`orderTokenBAmount`, orderTokenBAmount);
      console.log(`mintAmountA`, poolInfo?.poolInfo.mintAmountA);
      console.log(`mintAmountB`, poolInfo?.poolInfo.mintAmountB);
      console.log(`inAmount`, inAmount);
      console.log(`outAmount`, outAmount);
      console.groupEnd();

      // const [inputTokenMint, outputTokenMint] = isBuy
      //   ? [poolMintA!.address, poolMintB!.address]
      //   : [poolMintB!.address, poolMintA!.address];

      // const [inputTokenProgram, outputTokenProgram] = isBuy
      //   ? [poolMintA!.programId, poolMintB!.programId]
      //   : [poolMintB!.programId, poolMintA!.programId];

      // const [inputTokenProgram, outputTokenProgram] = [poolMintA!.programId, poolMintB!.programId];

      // await hybirdTradeProgram.add_order_v1(
      //   new PublicKey(inputTokenMint!),
      //   new PublicKey(outputTokenMint!),
      //   new PublicKey(inputTokenProgram!),
      //   new PublicKey(outputTokenProgram!),
      //   new BN(inAmount),
      //   new BN(outAmount),
      //   new BN(poolIdData?.pool_id),
      //   poolInfoData
      // );

      //
      await hybirdTradeProgram.add_order_v2(
        new PublicKey(inputTokenMint),
        new BN(inAmount),
        new BN(outAmount),
        new BN(poolIdData?.pool_id),
        poolInfoData
      );
    } catch (error) {
      console.error("Error preparing pool ID:", error);
    } finally {
      submitOrderLoading.setFalse();
    }
  };

  const handleSolToWsol = async () => {
    await hybirdTradeProgram.solToWsol(1 * LAMPORTS_PER_SOL);
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
              ? `${formatBalance(solBalance)} SOL`
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
              <div className="flex items-center gap-1">
                {/* <span className="text-xs text-muted-foreground">
                  {tokenA?.symbol}/{tokenB?.symbol}
                </span> */}
                {/* {isLoading ? (
                  <Skeleton className="w-16 h-4" />
                ) : (
                  <span className="text-xs text-muted-foreground">
                    ≈${getCurrentPriceInUSD(poolInfo)}
                  </span>
                )} */}
                {/* ≈${formatNumber(getCurrentPriceInUSD(poolInfo))} */}
                {/* {formatNumber(getCurrentPriceInUSD(poolInfo))}$ */}
                {/* ≈${getCurrentPriceInUSD(poolInfo)} */}
                {/* <Button
                  variant="ghost"
                  size="xs"
                  className="p-0 h-[15px] w-[15px]"
                  onClick={refreshTokenPrice}
                >
                  <Icon name="refresh" className="text-primary" />
                </Button> */}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex flex-row items-center gap-1">
              <span className="text-xs text-muted-foreground">1 SOL =</span>
              {isLoading ? (
                <Skeleton className="w-[120px] h-4" />
              ) : (
                <Input
                  id="price"
                  type="number"
                  className="border-none text-lg font-semibold text-right outline-none p-0 w-[110px]"
                  placeholder="0.00"
                  value={orderPrice}
                  onChange={(e) => setOrderPrice(e.target.value)}
                />
              )}
              <span className="text-xs text-muted-foreground">
                {poolInfo?.poolInfo.mintB.symbol}
              </span>
              <Button variant="ghost" size="xs" className="p-0 h-auto" onClick={refreshTokenPrice}>
                <Icon name="refresh" className="text-primary" />
              </Button>
            </div>
            <div className="flex items-start text-xs text-muted-foreground w-full justify-end">
              {isPoolLoading ? (
                <Skeleton className="w-16 h-4" />
              ) : (
                <span>
                  ${poolInfo?.poolInfo.mintB.symbol}≈${getCurrentPriceInUSD(poolInfo)}
                </span>
              )}
            </div>
            {/* <Button variant="ghost" size="xs" className="p-0 h-auto" onClick={refreshTokenPrice}>
              <Icon name="refresh" className="text-primary" />
            </Button>
            <div className="flex items-start text-xs text-muted-foreground w-full justify-end">
              {isPoolLoading ? (
                <Skeleton className="w-16 h-4" />
              ) : (
                <span>≈${poolInfo?.poolInfo.price}</span>
              )}
            </div> */}
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
              id="tokenA"
              type="number"
              className="border-none text-lg font-semibold text-right outline-none p-0"
              placeholder="0.00"
              value={orderTokenAAmount}
              disabled={isLoading}
              onChange={(e) => {
                setOrderTokenAAmount(e.target.value);
              }}
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
              id="tokenB"
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
          <div className="flex flex-col gap-2">
            <Button className="w-full" size="lg" onClick={handleSolToWsol}>
              {"Sol to Wsol"}
            </Button>

            <LoadingButton
              className="w-full"
              size="lg"
              disabled={!orderTokenAAmount || isPoolLoading}
              loading={submitOrderLoading.value}
              onClick={handleSubmitOrder}
            >
              {/* {isPoolLoading ? <Spinner size="small" /> : "Submit"} */}
              {"Submit"}
            </LoadingButton>
          </div>
        ) : (
          <Button className="w-full" size="lg" onClick={() => setConnectWalletModalOpen(true)}>
            Connect Wallet
          </Button>
        )}
      </div>
    </div>
  );
}
