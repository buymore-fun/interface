"use client";

import { TokenInfo } from "@/components/token-info";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { ChartType } from "@/types/chart";
import { PublicKey } from "@solana/web3.js";
import { WalletAuth } from "@/components/wallet-auth";
import { InitializePoolCard } from "./components/initialize-pool-card";
import { AddOrderCard } from "./components/add-order-card";
import { CancelOrderCard } from "./components/cancel-order-card";
import { RaydiumPoolInfoCard } from "./components/raydium-pool-info-card";
import { SwapCard } from "./components/swap-card";
import { GetPoolInfoCard } from "./components/get-pool-info-card";
import { TradeCard } from "./components/trade-card";

export default function DemoPage() {
  const { address } = useParams();

  const isVerified = useMemo(() => {
    return PublicKey.isOnCurve(address as string);
  }, [address]);

  if (!isVerified) {
    return <div>Invalid Token Address</div>;
  }

  return (
    <WalletAuth>
      <DemoPageContent />
    </WalletAuth>
  );
}

function DemoPageContent() {
  const { address } = useParams();

  return (
    <div className="flex gap-6 flex-col sm:flex-row">
      <div className="flex-1">
        <div className="flex flex-col">
          <div>
            <TokenInfo
              tokenAddress={address as string}
              type={ChartType.FIVE_MINUTE}
              onTypeChange={() => {}}
            />
          </div>

          {/* Hybrid Trade Functions UI */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InitializePoolCard />
            <AddOrderCard />
            <CancelOrderCard />
            <RaydiumPoolInfoCard />
            <SwapCard />
            <GetPoolInfoCard />
            <TradeCard />
          </div>
        </div>
      </div>
    </div>
  );
}
