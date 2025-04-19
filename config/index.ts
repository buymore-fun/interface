import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

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
  // const baseUrl = "https://explorer.solana.com";
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

export const network = "devnet";

const walletAdapterNetwork = getWalletAdapterNetwork(network);
const isMainnet = walletAdapterNetwork === WalletAdapterNetwork.Mainnet;

function getConfig() {
  if (network === "devnet") {
    return devConfig;
  }
  return mainnetConfig;
}

const devConfig = {
  // defaultPool: "4zzHMzNfqNEnuwBNGLFwh7RaYx8X6ThvgZptSJMVtVE7",
  defaultPool: "EQsVcoBFPeW3KtoenjKYY7zFhFmhooE2sdt5m3mKf8AK",
  programId: "kR2byBqUk8JHTWobckkmUVTafYaPgPT7QmbsMnCVZTY",
};

const mainnetConfig = {
  // defaultPool: "4zzHMzNfqNEnuwBNGLFwh7RaYx8X6ThvgZptSJMVtVE7",
  defaultPool: "EQsVcoBFPeW3KtoenjKYY7zFhFmhooE2sdt5m3mKf8AK",
  programId: "kR2byBqUk8JHTWobckkmUVTafYaPgPT7QmbsMnCVZTY",
};

const mergeConfig = getConfig();

const config = {
  network: network,
  walletAdapterNetwork: walletAdapterNetwork,
  isMainnet,
  ...mergeConfig,
};

export default config;
