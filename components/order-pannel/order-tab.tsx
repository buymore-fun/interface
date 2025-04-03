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
import { usePoolPrepareId } from "@/hooks/services";
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
interface OrderTabProps {
  poolId: string;
}

export function OrderTab({ poolId }: OrderTabProps) {
  const [, setConnectWalletModalOpen] = useConnectWalletModalOpen();
  const [price, setPrice] = useState<string>("");
  const { solPrice, isLoading: isSolPriceLoading } = useSolPrice();

  const { poolInfo, isLoading: isPoolLoading, fetchPoolInfo } = usePoolInfo(poolId);

  const isLoading = isSolPriceLoading || isPoolLoading;

  const token = useToken(poolId);
  const SOL = useToken(SOL_ADDRESS);

  const { solBalance } = useSolBalance();
  const { tokenBalance } = useTokenBalanceV2(poolInfo?.poolInfo.mintB.address);

  const hybirdTradeProgram = useHybirdTradeProgram("");

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

  const [inputToken, outputToken] = useMemo(
    () =>
      isBuy
        ? [poolInfo?.poolInfo.mintA.address, poolInfo?.poolInfo.mintB.address]
        : [poolInfo?.poolInfo.mintB.address, poolInfo?.poolInfo.mintA.address],
    [isBuy, poolInfo]
  );

  // ### 当前池子状态

  // - mintA是Sol: 0.036867143 SOL
  // - mintB是山寨币: 549851188.5306576 代币
  // - SOL价格: 124.7473490625 USD

  // ### 计算当前代币价格

  // 当前代币价格 = mintAmountA / mintAmountB
  // = 0.036867143 / 549851188.5306576
  // = 0.00000006704 SOL/代币

  // 以USD计价：
  // 代币价格 = 0.00000006704 \* 124.7473490625 = 0.00000836 USD/代币

  // ### Buy操作（用SOL购买代币）

  // 当用户用SOL购买代币时：

  // 1. 输入SOL数量(x)
  // 2. 计算可获得的代币数量(y)

  // 假设用户输入x SOL，则可获得的代币数量为：
  // y = (mintAmountB / mintAmountA) \* x

  // ### Sell操作（用代币兑换SOL）

  // 当用户用代币兑换SOL时：

  // 1. 输入代币数量(y)
  // 2. 计算可获得的SOL数量(x)

  // 假设用户输入y代币，则可获得的SOL数量为：
  // x = (mintAmountA / mintAmountB) \* y

  const { mutate: mutatePoolId } = usePoolPrepareId({
    input_token: inputToken || "",
    output_token: outputToken || "",
  });

  const getCurrentPrice = (cpmmPoolInfo?: CpmmPoolInfo, isReverse = true): number => {
    if (!cpmmPoolInfo) return 0;
    const poolInfo = cpmmPoolInfo.poolInfo;
    const amountA = new Decimal(poolInfo.mintAmountA).mul(10 ** poolInfo.mintA.decimals);
    const amountB = new Decimal(poolInfo.mintAmountB).mul(10 ** poolInfo.mintB.decimals);

    const price = isReverse ? amountA.div(amountB).toNumber() : amountB.div(amountA).toNumber();

    return price;
  };

  const getCurrentPriceInUSD = (cpmmPoolInfo?: CpmmPoolInfo) => {
    const price = getCurrentPrice(cpmmPoolInfo);
    const priceInUSD = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 9,
    }).format(price * solPrice);
    console.log("🚀 ~ getCurrentPrice ~ price:", priceInUSD);

    return priceInUSD;
  };

  useEffect(() => {
    if (poolInfo?.poolInfo) {
      const price = getCurrentPriceInUSD(poolInfo);
      setPrice(price);
    }
  }, [poolInfo]);

  useEffect(() => {
    if (orderTokenAAmount && price) {
      const amount = new Decimal(orderTokenAAmount).div(new Decimal(price)).toString();
      console.log("🚀 ~ useEffect ~ amount:", amount);
      setOrderTokenBAmount(amount);
    }
  }, [orderTokenAAmount, price, setOrderTokenBAmount]);

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

      const pool_state_env = {
        poolId: "427aCk5aRuXpUshfiaD9xewC3RRkj9uZDnzM4eUQ3bPm",
        mintA: "So11111111111111111111111111111111111111112",
        mintB: "H8RAUbA1PH8Gjaxj7awyf53TMrjBKNTQRQMM6TqGLQV8",
        vaultA: "HPnzZnEBeoRSSAMysZdWH3yWuaH96xmJ2sTXD727KPaA",
        vaultB: "CJ8zGLhDx5vxwYvYtba9t38h2MPjzhLVJAADAhzEotkT",
        observationId: "7f5yJ7stjZ876dZY2uYMrp5qzdER15RDjorXKbxn9wKM",
        mintLp: "9DhJcmNAEjBij8uXuAZMSaio3t3J9imsWdLwDaRzy4zZ",
        configId: "9zSzfkYy6awexsHvmggeH36pfVUdDGyCcwmjT3AQPBj6",
        poolCreator: "panACusRPNRs9Q2hTSzCnCSiWG8ysK5KeA5Nyib43SR",
        mintProgramA: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        mintProgramB: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        bump: 255,
        status: 0,
        lpDecimals: 9,
        mintDecimalA: 9,
        mintDecimalB: 9,
        openTime: "674d886b",
        lpAmount: "04184ac7c225",
        protocolFeesMintA: "00",
        protocolFeesMintB: "00",
        fundFeesMintA: "00",
        fundFeesMintB: "00",
      };

      const inAmount = new Decimal(orderTokenAAmount)
        .mul(10 ** pool_state_env.mintDecimalA)
        .toString();
      const outAmount = new Decimal(orderTokenBAmount)
        .mul(10 ** pool_state_env.mintDecimalB)
        .toString();

      console.group("add_order_v1");
      console.log("Got pool ID:", poolIdData.pool_id);
      console.log(`orderTokenAAmount`, orderTokenAAmount);
      console.log(`orderTokenBAmount`, orderTokenBAmount);
      console.log(`inAmount`, inAmount);
      console.log(`outAmount`, outAmount);
      console.groupEnd();

      await hybirdTradeProgram.add_order_v1(
        new BN(inAmount),
        new BN(outAmount),
        new BN(poolIdData.pool_id),
        pool_state_env
      );
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
                  className="border-none text-lg font-semibold text-right outline-none p-0 w-[110px]"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              )}
              <span className="text-xs text-muted-foreground">
                {poolInfo?.poolInfo.mintB.symbol || "BOB"}
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
                  ${poolInfo?.poolInfo.mintB.symbol || "BOB"}≈${getCurrentPriceInUSD(poolInfo)}
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
