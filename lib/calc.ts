import { SOL_ADDRESS } from "@/anchor/src";
import { CpmmPoolInfo } from "@/types";
import { ApiV3Token } from "@raydium-io/raydium-sdk-v2";
import { NATIVE_MINT } from "@solana/spl-token";
import Decimal from "decimal.js";

// export const getCurrentPrice = (cpmmPoolInfo?: CpmmPoolInfo, isReverse = true): number => {
//   if (!cpmmPoolInfo) return 0;
//   const poolInfo = cpmmPoolInfo.poolInfo;
//   // const amountA = new Decimal(poolInfo.mintAmountA).mul(10 ** poolInfo.mintA.decimals);
//   // const amountB = new Decimal(poolInfo.mintAmountB).mul(10 ** poolInfo.mintB.decimals);
//   const amountA = new Decimal(poolInfo.mintAmountA);
//   const amountB = new Decimal(poolInfo.mintAmountB);

//   const price = isReverse ? amountA.div(amountB).toNumber() : amountB.div(amountA).toNumber();
//   // console.log("🚀 ~ getCurrentPrice ~ price:", price);

//   return price;
// };

export const getCurrentPrice = (cpmmPoolInfo?: CpmmPoolInfo, isReverse = true): number => {
  if (!cpmmPoolInfo) return 0;

  const price = isReverse
    ? new Decimal(1).div(cpmmPoolInfo.poolInfo.price).toNumber()
    : cpmmPoolInfo.poolInfo.price;

  return +price.toFixed(9);
};

export const getCurrentPriceInUSD = (
  cpmmPoolInfo?: CpmmPoolInfo,
  isReverse = true,
  solPrice: number = 0
) => {
  const price = getCurrentPrice(cpmmPoolInfo, isReverse);

  const priceInUSD = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 9,
  }).format(price * solPrice);
  return priceInUSD;
};

export const getSymbolFromPoolInfo = (poolInfo?: ApiV3Token) => {
  if (poolInfo?.address === SOL_ADDRESS) {
    return "SOL";
  }

  // TODO MAINNET
  return poolInfo?.symbol || "BOB";
};
