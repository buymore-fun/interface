"use client";
import { usePrivyWallet } from "@/hooks/use-privy-wallet";
export default function TestPage() {
  const { publicKey } = usePrivyWallet();
  console.log("🚀 ~ TestPage ~ walletPublicKey:", publicKey, publicKey?.toBase58());
  return <div>Test</div>;
}
