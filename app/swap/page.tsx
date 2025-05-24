"use client";

import { Chart } from "@/components/chart";
import { TokenInfo } from "@/components/token-info";
import { OrderPanel } from "@/components/order-pannel/order-panel";
import { Community } from "@/components/community";
import { Overview } from "@/components/overview";
import { Activities } from "@/components/activities";
import { useSearchParams } from "next/navigation";
import { useChartData } from "@/hooks/use-chart";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { ChartType } from "@/types/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useServicePoolInfo } from "@/hooks/use-pool-info";
import { solChangeToToken } from "@/lib/constants";
import ClientOnly from "@/components/client-only";

function SwapContent() {
  const searchParams = useSearchParams();
  const inputMint = searchParams.get("inputMint");
  const outputMint = searchParams.get("outputMint");

  const [chartType, setChartType] = useState<ChartType>(ChartType.FIVE_MINUTE);
  const chartData = useChartData(inputMint as string, outputMint as string, chartType);

  const { fetchServicePoolInfo, isServicePoolInfoLoading, servicePoolInfo } = useServicePoolInfo();

  useEffect(() => {
    if (inputMint && outputMint) {
      fetchServicePoolInfo(
        solChangeToToken(inputMint as string),
        solChangeToToken(outputMint as string)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputMint, outputMint]);

  if (!inputMint || !outputMint) {
    return <div>Invalid input or output mint</div>;
  }

  if (!servicePoolInfo && !isServicePoolInfoLoading) {
    return <div>Pool info not found</div>;
  }

  return (
    <div className="flex gap-6 flex-col sm:flex-row">
      {isServicePoolInfoLoading ? (
        <Skeleton className="w-full h-[360px]" />
      ) : (
        <>
          <div className="flex-1">
            <div className="flex flex-col">
              <div>
                <TokenInfo
                  tokenAddress={outputMint as string}
                  type={chartType}
                  onTypeChange={setChartType}
                  inputMint={inputMint}
                  outputMint={outputMint}
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
              {/* Mobile view: OrderPanel first */}
              <div className="sm:hidden w-full mt-4">
                <OrderPanel />
              </div>
              <div className="mt-4">
                <Overview />
              </div>
              <div className="mt-4">
                <ClientOnly>
                  <Activities inputMint={inputMint} outputMint={outputMint} />
                </ClientOnly>
              </div>
            </div>
          </div>
          {/* Desktop view: OrderPanel in sidebar */}
          <div className="hidden sm:flex sm:max-w-[420px] w-full flex-col space-y-4">
            <OrderPanel />
            <Community />
          </div>
          {/* Mobile view: Community component */}
          <div className="sm:hidden w-full mt-4">
            <Community />
          </div>
        </>
      )}
    </div>
  );
}

export default function Swap() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SwapContent />
    </Suspense>
  );
}
