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
import { raydium } from "@/lib/raydium/config";
import { CpmmPoolInfo } from "@/types";

export default function Token() {
  const { poolId } = useParams();
  const connection = useConnection();
  const [chartType, setChartType] = useState<ChartType>(ChartType.FIVE_MINUTE);
  const chartData = useChartData(poolId as string, chartType);
  const [poolInfo, setPoolInfo] = useState<CpmmPoolInfo | undefined>();

  const wallet = useWallet();

  const fetchPoolInfo = useCallback(async () => {
    console.log("🚀 ~ Token ~ poolId:", poolId);

    try {
      const poolInfo = await raydium?.cpmm.getPoolInfoFromRpc(poolId as string);
      console.log("🚀 ~ Token ~ poolInfo:", poolInfo);

      if (poolInfo) {
        setPoolInfo(poolInfo);
      }
    } catch (error) {
      console.error("🚀 ~ Token ~ error:", error);
    }
  }, [poolId]);

  useEffect(() => {
    if (!raydium?.ownerPubKey) return;
    fetchPoolInfo();
  }, [poolId, raydium?.ownerPubKey]);

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
