"use client";

import { usePrivyWallet } from "@/hooks/use-privy-wallet";
import { Button } from "./ui/button";
import { useConnectWalletModalOpen } from "@/hooks/use-connect-wallet-modal";
// import { useWallet } from "@solana/wallet-adapter-react";

export function WalletAuth({ children }: { children: React.ReactNode }) {
  const [, setOpen] = useConnectWalletModalOpen();
  // const { publicKey } = useWallet();
  const { publicKey } = usePrivyWallet();
  if (publicKey) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <h2 className="text-xl font-semibold">Connect Wallet</h2>
      <p className="text-muted-foreground text-center">
        Please connect your wallet to access this feature
      </p>
      <Button onClick={() => setOpen(true)} size="lg">
        Connect Wallet
      </Button>
    </div>
  );
}
