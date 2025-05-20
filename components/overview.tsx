import { useDashboardIndex } from "@/hooks/services";
import { useParams, useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardTime } from "@/types/chart";
import { TimeGroup } from "@/components/time-group";
import { useState } from "react";
import { solChangeToToken } from "@/lib/constants";
export function Overview() {
  const { address } = useParams();
  const [tableType, setTableType] = useState<DashboardTime>(DashboardTime.ALL);
  const searchParams = useSearchParams();
  const inputMint = searchParams.get("inputMint");
  const outputMint = searchParams.get("outputMint");
  const { data, isLoading } = useDashboardIndex({
    input_token: solChangeToToken(inputMint as string),
    output_token: solChangeToToken(outputMint as string),
    tt: "all",
  });

  return (
    <div className="pt-4">
      <div className="flex justify-between">
        <span className="font-semibold text-lg">Dashboard</span>
        <TimeGroup
          typeObject={DashboardTime}
          onTypeChange={(type) => setTableType(type as DashboardTime)}
          selectedType={tableType}
        />
      </div>
      <div className="border rounded-lg mt-2 bg-secondary/20 px-5 py-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total volume</span>
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <span className="font-semibold">${formatPrice(data?.total_volume)}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Traders</span>
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <span className="font-semibold">{formatPrice(data?.traders)}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Orders</span>
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <span className="font-semibold">{formatPrice(data?.orders)}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Value of Buymore</span>
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <span className="font-semibold">${formatPrice(data?.value_of_buymore)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
