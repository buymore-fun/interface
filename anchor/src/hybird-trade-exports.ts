// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Cluster, clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import HybirdTradeIDL from "../target/idl/hybird_trade.json";
import type { HybirdTrade } from "../target/types/hybird_trade";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

// Re-export the generated IDL and type
export { HybirdTrade, HybirdTradeIDL };

// The programId is imported from the program IDL.
export const HYBIRD_TRADE_PROGRAM_ID = new PublicKey(HybirdTradeIDL.address);

// const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const TOKEN_2022_PROGRAM_ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
export const ATA_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

// This is a helper function to get the Counter Anchor program.
export function getHybirdTradeProgram(provider: AnchorProvider) {
  return new Program<HybirdTrade>(HybirdTradeIDL, provider);
}

export const programId = getHybirdTradeProgramId(WalletAdapterNetwork.Devnet);

// This is a helper function to get the program ID for the Counter program depending on the cluster.
export function getHybirdTradeProgramId(cluster: Cluster) {
  switch (cluster) {
    case WalletAdapterNetwork.Devnet:
      return new PublicKey("2qu2RXkqye2ZcZ1eiTtWtDMa2Pnd3Q9kzDRCUdGMYHFZ");
    case WalletAdapterNetwork.Testnet:
    case WalletAdapterNetwork.Mainnet:
    default:
      return HYBIRD_TRADE_PROGRAM_ID;
  }
}
