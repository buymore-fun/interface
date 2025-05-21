import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
// Use environment variables
export const network = process.env.NEXT_PUBLIC_NETWORK as string;
// export const network = {
//   mainnet: "mainnet-beta",
//   devnet: "devnet",
//   testnet: "testnet",
// };

export const getWalletAdapterNetwork = (network: string) => {
  switch (network) {
    case "devnet":
      return WalletAdapterNetwork.Devnet;
    case "testnet":
      return WalletAdapterNetwork.Testnet;
    case "mainnet":
    case "mainnet-beta":
      return WalletAdapterNetwork.Mainnet;
    default:
      return WalletAdapterNetwork.Devnet;
  }
};

export function getClusterUrlParam(network: WalletAdapterNetwork): string {
  let suffix = "";
  switch (network) {
    case WalletAdapterNetwork.Devnet:
      suffix = "devnet";
      break;
    case WalletAdapterNetwork.Mainnet:
      suffix = "";
      break;
    case WalletAdapterNetwork.Testnet:
      suffix = "testnet";
      break;
  }

  return suffix.length ? `?cluster=${suffix}` : "";
}

export function getExplorerUrl(path: string) {
  const baseUrl = "https://solscan.io";
  const params = getClusterUrlParam(config.walletAdapterNetwork);

  return `${baseUrl}${path}${params}`;
}

export function getExplorerUrlFromTransaction(signature: string) {
  return getExplorerUrl(`/tx/${signature}`);
}

export function getExplorerUrlFromAddress(address: string) {
  return getExplorerUrl(`/address/${address}`);
}

export function getExplorerUrlFromBlock(block: string) {
  return getExplorerUrl(`/block/${block}`);
}

export function getExplorerUrlFromToken(token: string) {
  return getExplorerUrl(`/token/${token}`);
}

const walletAdapterNetwork = getWalletAdapterNetwork(network);
const isMainnet = walletAdapterNetwork === WalletAdapterNetwork.Mainnet;

// Configuration directly from environment variables
const config = {
  network: network,
  walletAdapterNetwork: walletAdapterNetwork,
  isMainnet,
  defaultPool: process.env.NEXT_PUBLIC_DEFAULT_POOL,
  programId: process.env.NEXT_PUBLIC_PROGRAM_ID,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL,
  raydiumCpSwap: process.env.NEXT_PUBLIC_RAYDIUM_CP_SWAP,
  privyAppId: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  privyClientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID,
  privyAppSecret: process.env.PRIVY_APP_SECRET,
};
console.log("🚀 ~ config:", config);

const PAID_RPC_ENDPOINTS = {
  //  paid rpc
  "mainnet-beta": [
    "https://solana-rpc.publicnode.com",
    "https://api.mainnet-beta.solana.com",
    "https://rpc.ankr.com/solana",
    "https://mainnet.helius-rpc.com/?api-key=806e5319-b980-41ad-9739-61cce20d0c28",
  ],
};

export const getConnectionEndpoint = () => {
  if (config.walletAdapterNetwork === "mainnet-beta") {
    const paidRpc = PAID_RPC_ENDPOINTS["mainnet-beta"][0];
    // console.log(`[Solana RPC] Using PAID RPC for mainnet-beta: ${paidRpc}`);
    return paidRpc;
  }

  const publicRpc = clusterApiUrl(config.walletAdapterNetwork);
  console.log(`[Solana RPC] Using public RPC for ${config.walletAdapterNetwork}: ${publicRpc}`);
  return publicRpc;
};

export default config;
