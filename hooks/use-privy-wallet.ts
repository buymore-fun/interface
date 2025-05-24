import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { usePrivy } from "@privy-io/react-auth";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";

export function usePrivyWallet() {
  const { wallets } = useSolanaWallets();
  const { ready, authenticated, user } = usePrivy();
  const [walletPublicKey, setWalletPublicKey] = useState<PublicKey | null>(null);
  const solanaWallet = wallets[0];

  const getWalletPublicKey = useCallback(() => {
    const addressString = solanaWallet?.address;
    if (!addressString) return null;
    try {
      const publicKey = new PublicKey(addressString);
      return publicKey;
    } catch (e) {
      console.error("Failed to create PublicKey:", e);
      return null;
    }
  }, [solanaWallet?.address]);

  useEffect(() => {
    if (ready && authenticated) {
      const publicKey = getWalletPublicKey();
      setWalletPublicKey(publicKey);
    } else {
      setWalletPublicKey(null);
    }
  }, [ready, authenticated, getWalletPublicKey]);

  return {
    publicKey: walletPublicKey,
    authenticated,
    ready, 
    user,
    wallets,
  };
}
