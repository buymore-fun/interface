"use client";

import { WalletReadyState, WalletName } from "@solana/wallet-adapter-base";
import { BaseModal } from "./base-modal";
import { useConnectWalletModalOpen } from "@/hooks/use-connect-wallet-modal";
import { useWallet } from "@solana/wallet-adapter-react";
import type { Wallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useMemo } from "react";
import Image from "next/image";

function WalletItem({
  wallet,
  installed,
  onClick,
}: {
  wallet: Wallet;
  installed?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="flex border bg-secondary/60 justify-between items-center px-4 py-3 rounded-lg hover:bg-secondary cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <Image
          src={wallet.adapter.icon}
          className="size-8 rounded-full"
          width={128}
          height={128}
          alt={wallet.adapter.name}
        />
        <span className="font-semibold">{wallet.adapter.name}</span>
      </div>
      {installed && (
        <span className="text-muted-foreground text-sm">Installed</span>
      )}
    </div>
  );
}

export function ConnectWalletModal() {
  const [open, setOpen] = useConnectWalletModalOpen();
  const { wallets, select, publicKey } = useWallet();

  const [installetWallets, otherWallets] = useMemo(() => {
    const installed: Wallet[] = [];
    const notDetected: Wallet[] = [];
    const loadable: Wallet[] = [];

    for (const wallet of wallets) {
      if (wallet.readyState === WalletReadyState.NotDetected) {
        notDetected.push(wallet);
      } else if (wallet.readyState === WalletReadyState.Loadable) {
        loadable.push(wallet);
      } else if (wallet.readyState === WalletReadyState.Installed) {
        installed.push(wallet);
      }
    }

    return [installed, [...loadable, ...notDetected]];
  }, [wallets]);

  const handleWalletClick = useCallback(
    (walletName: WalletName) => {
      select(walletName);
    },
    [select]
  );

  useEffect(() => {
    if (open && publicKey) {
      setOpen(false);
    }
  }, [publicKey, open, setOpen]);

  return (
    <BaseModal open={open} setOpen={setOpen} title="Connect Wallet">
      <div className="flex flex-col space-y-2">
        {installetWallets.map((wallet, idx) => (
          <WalletItem
            wallet={wallet}
            key={idx}
            installed
            onClick={() => handleWalletClick(wallet.adapter.name)}
          />
        ))}
        {otherWallets.map((wallet, idx) => (
          <WalletItem
            wallet={wallet}
            key={idx}
            onClick={() => handleWalletClick(wallet.adapter.name)}
          />
        ))}
      </div>
    </BaseModal>
  );
}
