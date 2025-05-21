"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import config from "@/config";

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={config.privyAppId as string}
      clientId={config.privyClientId as string}
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "all-users",
        },
        // If you need Solana wallets, uncomment and import the necessary function:
        // externalWallets: {
        //   solana: { connectors: toSolanaWalletConnectors() },
        // },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
