import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

// export const network = {
//   mainnet: "mainnet-beta",
//   devnet: "devnet",
//   testnet: "testnet",
// };
export const network = "devnet";

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

export const config = {
  walletAdapterNetwork: getWalletAdapterNetwork(network),
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
  const baseUrl = "https://explorer.solana.com";
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
