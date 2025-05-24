"use client";

import { PrivyProvider, usePrivy, useSendTransaction } from "@privy-io/react-auth";
import { toSolanaWalletConnectors, useSolanaWallets } from "@privy-io/react-auth/solana";

import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { usePrivyWallet } from "@/hooks/use-privy-wallet";
import { connection } from "@/lib/raydium/config";
import config from "@/config";

export function usePrivyAnchorProvider() {
  // const { connection } = useConnection();
  const { ready, authenticated } = usePrivy();
  const { wallets } = useSolanaWallets();
  const { publicKey } = usePrivyWallet();

  const wallet = wallets[0];

  // todo wallet should be AnchorWallet
  return new AnchorProvider(
    connection,
    {
      publicKey: publicKey!,
      signTransaction: async (tx) => {
        const signature = await wallet.signTransaction(tx);
        return signature;
      },
      signAllTransactions: async (txs) => {
        const signatures = await wallet.signAllTransactions(txs);
        return signatures;
      },
    },
    {
      commitment: "confirmed",
    }
  );
}

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={config.privyAppId as string}
      config={{
        appearance: {
          accentColor: "#26858c",
          theme: "#222224",
          showWalletLoginFirst: false,
          walletChainType: "solana-only",
          //  "solflare", "backpack"
          walletList: ["detected_solana_wallets", "phantom", "okx_wallet"],
        },
        loginMethods: ["wallet"],
        fundingMethodConfig: {
          moonpay: {
            useSandbox: true,
          },
        },
        embeddedWallets: {
          requireUserPasswordOnCreate: false,
          showWalletUIs: true,
          ethereum: {
            createOnLogin: "off",
          },
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
        mfa: {
          noPromptOnMfaRequired: false,
        },
        externalWallets: { solana: { connectors: toSolanaWalletConnectors() } },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
