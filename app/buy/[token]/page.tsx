"use client";

import { Chart } from "@/components/chart";
import { TokenInfo } from "@/components/token-info";
import { OrderPanel } from "@/components/order-panel";
import { Community } from "@/components/community";
import { Overview } from "@/components/overview";
import { Activities } from "@/components/activities";
import { useParams } from "next/navigation";
import { useChartData } from "@/hooks/use-chart";
import { Loader2 } from "lucide-react";

export default function Buy() {
  const { token } = useParams();
  const chartData = useChartData(token as string);

  return (
    <div className="flex gap-6 flex-col sm:flex-row">
      <div className="flex-1">
        <div className="flex flex-col">
          <div>
            <TokenInfo tokenAddress={token as string} />
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
        <OrderPanel tokenAddress={token as string} />
        <Community />
      </div>
    </div>
  );
}
