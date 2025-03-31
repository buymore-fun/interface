import { atomWithStorage } from "jotai/utils";
import { OrderType } from "@/consts/order";

// Add Order Card atoms
export const inAmountStorage = atomWithStorage("demo_in_amount", "");
export const outAmountStorage = atomWithStorage("demo_out_amount", "");
export const orderTypeStorage = atomWithStorage("demo_order_type", OrderType.Buy);
export const poolIdStorage = atomWithStorage("demo_pool_id", 1);

// Trade Card atoms
export const tradeInAmountStorage = atomWithStorage("demo_trade_in_amount", "");
export const tradeOutAmountStorage = atomWithStorage("demo_trade_out_amount", "");

// Pool related atoms
export const raydiumPoolIdStorage = atomWithStorage(
  "demo_raydium_pool_id",
  "26auA3dMfiqK8SWBCkzShhkaSTbbWYQ3jrwhBQZCW5gT"
);
export const tokenMintAddressStorage = atomWithStorage(
  "demo_token_mint_address",
  "9T7uw5dqaEmEC4McqyefzYsEg5hoC4e2oV8it1Uc4f1U"
);
