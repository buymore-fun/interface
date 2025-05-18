// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Cluster, clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import HybirdTradeIDL from "../target/idl/hybird_trade_v2.json";
import type { HybirdTradeV2 } from "../target/types/hybird_trade_v2";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import config from "@/config";

// Import SOL address constant
export const SOL_ADDRESS = "So11111111111111111111111111111111111111112";

// Re-export the generated IDL and type
export { HybirdTradeV2, HybirdTradeIDL };

// The programId is imported from the program IDL.
// export const HYBIRD_TRADE_PROGRAM_ID = new PublicKey(HybirdTradeIDL.address);
export const HYBIRD_TRADE_PROGRAM_ID = new PublicKey(config.programId!);

const BUY_MORE_PROGRAM_ID = config.programId!;

const BUYMORE_PROGRAM = new PublicKey(BUY_MORE_PROGRAM_ID);

// This is a helper function to get the Counter Anchor program.
export function getHybirdTradeProgram(provider: AnchorProvider) {
  return new Program<HybirdTradeV2>(HybirdTradeIDL as any, BUYMORE_PROGRAM, provider);
}

// // This is a helper function to get the program ID for the Counter program depending on the cluster.
// export function getHybirdTradeProgramId(cluster: Cluster) {
//   switch (cluster) {
//     case WalletAdapterNetwork.Devnet:
//       return new PublicKey(config.programId!);
//     case WalletAdapterNetwork.Testnet:
//     case WalletAdapterNetwork.Mainnet:
//     default:
//       return HYBIRD_TRADE_PROGRAM_ID;
//   }
// }

const SEEDS = {};

export function getSeeds(program: Program<HybirdTradeV2>) {
  program.idl.constants.forEach((v) => {
    const { name, type, value } = v;
    if (type === "bytes") {
      SEEDS[name] = Buffer.from(JSON.parse(value));
    } else {
      SEEDS[name] = value;
    }
  });
  return SEEDS;
}
