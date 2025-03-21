import { useDashboardIndex } from "@/hooks/services";
import { useParams } from "next/navigation";
import { formatNumber } from "@/lib/utils/format-number";
import { Skeleton } from "@/components/ui/skeleton";

export function Overview() {
  const { address } = useParams();

  const { data, isLoading } = useDashboardIndex({
    inputMint: address as string,
  });

  return (
    <div>
      <div className="flex justify-between">
        <span className="font-semibold text-lg">Overview</span>
      </div>
      <div className="border rounded-lg mt-2 grid grid-cols-4 py-3 bg-secondary/20">
        <div className="flex flex-col items-center justify-center border-r">
          <span className="text-sm text-muted-foreground">Total volume</span>
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <span className="font-semibold">${formatNumber(data?.total_volume)}</span>
          )}
        </div>
        <div className="flex flex-col items-center justify-center border-r">
          <span className="text-sm text-muted-foreground">Traders</span>
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <span className="font-semibold">{formatNumber(data?.traders)}</span>
          )}
        </div>
        <div className="flex flex-col items-center justify-center border-r">
          <span className="text-sm text-muted-foreground">Orders</span>
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <span className="font-semibold">{formatNumber(data?.orders)}</span>
          )}
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm text-muted-foreground">Value of Buymore</span>
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <span className="font-semibold">${formatNumber(data?.value_of_buymore)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
