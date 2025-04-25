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
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import WalletIcon from "@/public/assets/token/wallet.svg";
import { useMemo, useEffect } from "react";
import { useSolBalance, useTokenBalanceV2 } from "@/hooks/use-sol-balance";
import { useRaydiumPoolInfo, useServicePoolInfo } from "@/hooks/use-pool-info";
import Decimal from "decimal.js";
import { formatBalance, formatFloor } from "@/lib/utils";
import { useHybirdTradeProgram } from "@/hooks/hybird-trade/hybird-trade-data-access";
import { BN } from "@coral-xyz/anchor";
import { useSolPrice } from "@/hooks/use-sol-price";
import { CpmmPoolInfo } from "@/types/raydium";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { IResponsePoolInfoItem } from "@/types/response";
import { LoadingButton } from "@/components/ui/loading-button";
import { useBoolean } from "@/hooks/use-boolean";
import { getCurrentPrice, getSymbolFromPoolInfo } from "@/lib/calc";
import { useAnchorProvider } from "@/app/solana-provider";
import { useTransactionToast } from "@/hooks/use-transaction-toast";
// import { useMyOrders } from "@/hooks/use-activities";
// import { toast } from "react-hot-toast";
import { useCommonToast } from "@/hooks/use-common-toast";
// interface OrderTabProps {}

export function OrderTab() {
  const { errorToast } = useCommonToast();
  const [, setConnectWalletModalOpen] = useConnectWalletModalOpen();
  const [orderPrice, setOrderPrice] = useState<string>("");
  const { solPrice, isLoading: isSolPriceLoading } = useSolPrice();
  const [isHovered, setIsHovered] = useState(false);

  const submitOrderLoading = useBoolean(false);

  const { raydiumPoolInfo, isRaydiumLoading, fetchRaydiumPoolInfo } = useRaydiumPoolInfo();
  const { servicePoolInfo, isServicePoolInfoLoading } = useServicePoolInfo();

  const isLoading = isSolPriceLoading;

  const SOL = useToken(SOL_ADDRESS);
  const token = useToken(servicePoolInfo!.cpmm.mintB);

  const { fetchSolBalance, solBalance } = useSolBalance();
  const { tokenBalance, mutateTokenBalance } = useTokenBalanceV2(
    raydiumPoolInfo?.poolInfo.mintB.address
  );

  const hybirdTradeProgram = useHybirdTradeProgram("");

  const { publicKey } = useWallet();
  const [orderType, setOrderType] = useState<OrderType>(OrderType.Buy);
  const [orderTokenAAmount, setOrderTokenAAmount] = useState("");
  const [orderTokenBAmount, setOrderTokenBAmount] = useState("");

  const provider = useAnchorProvider();
  const transactionToast = useTransactionToast();

  // TO BUY SHIT COIN
  const isBuy = orderType === OrderType.Buy;

  const [tokenA, tokenB] = useMemo(
    () => (isBuy ? [SOL, token] : [token, SOL]),
    [isBuy, token, SOL]
  );

  const [poolMintA, poolMintB] = useMemo(
    () =>
      isBuy
        ? [raydiumPoolInfo?.poolInfo.mintA, raydiumPoolInfo?.poolInfo.mintB]
        : [raydiumPoolInfo?.poolInfo.mintB, raydiumPoolInfo?.poolInfo.mintA],
    [isBuy, raydiumPoolInfo]
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
  const searchParams = useSearchParams();

  const inputMint = searchParams.get("inputMint");
  const outputMint = searchParams.get("outputMint");
  // const { fetchMyOrders } = useMyOrders(inputMint || "", outputMint || "");

  const [priceState, setPriceState] = useState(0);

  useEffect(() => {
    const newPrice = getCurrentPrice(raydiumPoolInfo, false);
    setPriceState(newPrice);
  }, [raydiumPoolInfo, isBuy]);

  const getCurrentPriceInUSD = (cpmmPoolInfo?: CpmmPoolInfo) => {
    const price = getCurrentPrice(cpmmPoolInfo, isBuy);

    // const priceToUse = orderPrice ? Number(orderPrice ) : price;
    const priceToUse = orderPrice ? Number(orderPrice) : price;

    if (priceToUse === price) {
      return "--";
    }

    const priceInUSD = isBuy
      ? new Intl.NumberFormat("en-US", {
          maximumFractionDigits: 4,
        }).format(solPrice / priceToUse)
      : new Intl.NumberFormat("en-US", {
          maximumFractionDigits: 4,
        }).format(priceToUse * solPrice);

    // Default to showing just the price in USD
    return priceInUSD;
  };

  useEffect(() => {
    if (raydiumPoolInfo?.poolInfo) {
      const price = getCurrentPrice(raydiumPoolInfo, !isBuy);
      setOrderPrice(price.toString());
    }
  }, [raydiumPoolInfo, isBuy, priceState]);

  useEffect(() => {
    if (orderTokenAAmount && orderPrice) {
      // if (isBuy) {
      //   const _orderTokenBAmount = new Decimal(orderTokenAAmount)
      //     .mul(new Decimal(orderPrice))
      //     .toString();

      //   setOrderTokenBAmount(_orderTokenBAmount);
      // } else {
      //   const _orderTokenBAmount = new Decimal(orderTokenAAmount)
      //     .mul(new Decimal(orderPrice))
      //     .toString();

      //   setOrderTokenBAmount(_orderTokenBAmount);
      // }
      const _orderTokenBAmount = new Decimal(orderTokenAAmount)
        .mul(new Decimal(orderPrice))
        .toString();

      setOrderTokenBAmount(_orderTokenBAmount);
    }
  }, [orderTokenAAmount, orderPrice, setOrderTokenBAmount, isBuy]);

  const toggleOrderType = () => {
    setOrderType(isBuy ? OrderType.Sell : OrderType.Buy);
    setOrderTokenAAmount("");
  };

  const cleanInput = () => {
    setOrderTokenAAmount("");
    setOrderTokenBAmount("");
    if (raydiumPoolInfo?.poolInfo) {
      const price = getCurrentPrice(raydiumPoolInfo, !isBuy);
      setOrderPrice(price.toString());
    }
  };

  const refreshTokenPrice = () => {
    if (isRaydiumLoading) return;
    fetchRaydiumPoolInfo(servicePoolInfo!.cpmm.poolId);
  };

  const handleSubmitOrder = async () => {
    try {
      submitOrderLoading.setTrue();
      const poolIdData = await mutatePoolId();

      if (!poolIdData?.pool_id || !raydiumPoolInfo || !servicePoolInfo) {
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

      if (+inAmount && +inAmount > +tokenABalance) {
        errorToast("Swap Failed", "Insufficient balance");
        return;
      }

      await hybirdTradeProgram.initialize_pool(poolIdData.pool_id, servicePoolInfo!);

      const [inputTokenMint, outputTokenMint] = [poolMintA!.address, poolMintB!.address];

      console.group("handleSubmitOrder");
      console.log("inputTokenMint", inputTokenMint);
      console.log("outputTokenMint", outputTokenMint);
      console.log("poolInfoData", servicePoolInfo);
      console.log("raydiumPoolInfo", raydiumPoolInfo);
      console.log("orderPrice", orderPrice);
      console.log("getCurrentPrice", getCurrentPrice(raydiumPoolInfo));
      console.log("getCurrentPriceInUSD", getCurrentPriceInUSD(raydiumPoolInfo));
      console.log("Got pool ID", poolIdData.pool_id);
      console.log(`orderTokenAAmount`, orderTokenAAmount);
      console.log(`orderTokenBAmount`, orderTokenBAmount);
      console.log(`mintAmountA`, raydiumPoolInfo?.poolInfo.mintAmountA);
      console.log(`mintAmountB`, raydiumPoolInfo?.poolInfo.mintAmountB);
      console.log(`inAmount`, inAmount);
      console.log(`outAmount`, outAmount);
      console.groupEnd();

      const tx = await hybirdTradeProgram.add_order_v2(
        new PublicKey(inputTokenMint),
        new BN(inAmount),
        new BN(outAmount),
        new BN(poolIdData?.pool_id),
        servicePoolInfo
      );

      const sig1 = await provider.sendAndConfirm(tx);

      await fetchSolBalance();
      await mutateTokenBalance();

      console.log("Your transaction signature", sig1);
      transactionToast(sig1);
    } catch (error) {
      console.error("Error preparing pool ID:", error);
      errorToast(
        "Swap Failed",
        <>
          Request signature: <br />
          user denied request signature.
        </>
      );
    } finally {
      submitOrderLoading.setFalse();
      cleanInput();
    }
  };

  // const handleSolToWsol = async () => {
  //   await hybirdTradeProgram.solToWsol(1 * LAMPORTS_PER_SOL);
  // };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">
          {/* Order type: {isBuy ? "Buying" : "Selling"} */}
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1 ">
          <Image src={WalletIcon} alt="Wallet" />
          <span>
            {isBuy
              ? `${formatFloor(formatBalance(solBalance, 9))} ${getSymbolFromPoolInfo(poolMintA)}`
              : `${formatFloor(tokenBalance!.uiAmountString || "0")} ${getSymbolFromPoolInfo(poolMintA)}`}
          </span>
        </div>
      </div>

      <div className="p-4 bg-accent border-[0.5px] border-primary rounded-lg shadow-lg shadow-primary/20">
        <div className="flex items-center justify-between bg-light-card/70 p-2 rounded-lg h-[60px] shadow-md shadow-background/25">
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
          <div className="flex flex-col items-end ">
            <div className="flex flex-row items-center gap-1">
              <span className="text-xs text-muted-foreground">
                1 {getSymbolFromPoolInfo(poolMintA)} =
              </span>
              {isLoading ? (
                <Skeleton className="w-[120px] h-4" />
              ) : (
                <Input
                  id="price"
                  type="number"
                  className="border-none text-lg font-semibold text-right outline-none p-0 w-[110px] h-6"
                  placeholder="0.00"
                  min={0}
                  value={formatFloor(orderPrice)}
                  onChange={(e) => {
                    setOrderPrice(e.target.value);
                  }}
                />
              )}
              <span className="text-xs text-muted-foreground">
                {getSymbolFromPoolInfo(poolMintB)}
              </span>
              <Button variant="ghost" size="xs" className="p-0 h-auto" onClick={refreshTokenPrice}>
                <Icon name="refresh" className="text-primary" />
              </Button>
            </div>
            <div className="flex items-start text-xs text-muted-foreground w-full justify-end">
              {isRaydiumLoading ? (
                <Skeleton className="w-16 h-4" />
              ) : (
                <span>
                  {getSymbolFromPoolInfo(raydiumPoolInfo?.poolInfo.mintB)}≈$
                  {getCurrentPriceInUSD(raydiumPoolInfo)}
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

        <div className="flex items-center gap-2 pt-3 ">
          <div className="flex items-center  w-[220px] px-2">
            <div className="text-sm ">From</div>
          </div>
          <div className="flex items-center w-[180px] px-2">
            <div className="text-sm ">To</div>
          </div>
        </div>
        <div className="flex items-center justify-between pb-3 pt-1 gap-2 ">
          <div className="flex items-center gap-2 bg-light-card/70 p-2 rounded-lg h-[60px] w-[180px]  shadow-md shadow-background/25">
            {tokenA ? (
              <Button variant="ghost" className="px-0">
                <TokenIcon token={tokenA} size="sm" />
                {getSymbolFromPoolInfo(poolMintA)}
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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex items-center justify-center"
          >
            {isHovered ? (
              <Icon name="switch-v2" className="text-primary w-6 h-6" />
            ) : (
              <Icon name="arrow-right" className="text-primary w-6 h-6" />
            )}
          </Button>

          <div className="flex items-center gap-2 bg-light-card/70 p-2 rounded-lg h-[60px] w-[180px]  shadow-md shadow-background/25">
            {tokenB ? (
              <Button variant="ghost" className="px-0">
                <TokenIcon token={tokenB} size="sm" />
                {getSymbolFromPoolInfo(poolMintB)}
              </Button>
            ) : (
              <Skeleton className="h-9 w-24" />
            )}
            <Input
              id="tokenB"
              className="border-none text-lg font-semibold text-right outline-none p-0 disabled:cursor-not-allowed"
              placeholder="0.00"
              value={formatFloor(orderTokenBAmount)}
              disabled={true}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 text-sm text-muted-foreground text-right">
        Fee: 0% (<span className="line-through">0.25%</span>)
      </div>

      <div className="mt-4 mb-2">
        {publicKey ? (
          <div className="flex flex-col gap-2">
            {/* <Button className="w-full" size="lg" onClick={handleSolToWsol}>
              {"Sol to Wsol"}
            </Button> */}

            <LoadingButton
              className="w-full"
              size="lg"
              disabled={!orderTokenAAmount || isRaydiumLoading}
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
