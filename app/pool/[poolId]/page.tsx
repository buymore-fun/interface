"use client";

import { Chart } from "@/components/chart";
import { TokenInfo } from "@/components/token-info";
import { OrderPanel } from "@/components/order-pannel/order-panel";
import { Community } from "@/components/community";
import { Overview } from "@/components/overview";
import { Activities } from "@/components/activities";
import { useParams } from "next/navigation";
import { useChartData } from "@/hooks/use-chart";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { ChartType } from "@/types/chart";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { CpmmPoolInfo } from "@/types";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { usePoolInfo } from "@/hooks/use-pool-info";
export default function Token() {
  const { poolId } = useParams();
  const { publicKey } = useWallet();
  const [chartType, setChartType] = useState<ChartType>(ChartType.FIVE_MINUTE);
  const chartData = useChartData(poolId as string, chartType);
  // const [poolInfo, setPoolInfo] = useState<CpmmPoolInfo | undefined>();
  const { connection } = useConnection();
  const wallet = useWallet();
  const { poolInfo, fetchPoolInfo, isLoading, error } = usePoolInfo();

  useEffect(() => {
    if (wallet.publicKey) {
      fetchPoolInfo(poolId as string);
    }
  }, [wallet.publicKey, fetchPoolInfo, poolId]);

  return (
    <div className="flex gap-6 flex-col sm:flex-row">
      <div className="flex-1">
        <div className="flex flex-col">
          <div>
            <TokenInfo
              tokenAddress={poolId as string}
              type={chartType}
              onTypeChange={setChartType}
            />
            <div className="mt-2 h-[360px]">
              {chartData?.length ? (
                <Chart data={chartData} />
              ) : (
                <div className="flex w-full h-full items-center justify-center bg-secondary/10">
                  <Loader2 className="size-8 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
          <div className="mt-4">
            <Overview />
          </div>
          <div className="mt-4">
            <Activities />
          </div>
        </div>
      </div>
      <div className="sm:max-w-[420px] w-full flex flex-col space-y-4">
        <OrderPanel tokenAddress={poolId as string} />
        <Community />
      </div>
    </div>
  );
}
