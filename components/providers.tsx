"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PropsWithChildren, useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export function Providers({ children }: PropsWithChildren) {
  const network = WalletAdapterNetwork.Mainnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/anza-xyz/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      new UnsafeBurnerWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}
