import { useDashboardIndex } from "@/hooks/services";
import { useParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function Overview() {
  const { address } = useParams();

  const { data, isLoading } = useDashboardIndex({
    inputMint: address as string,
  });

  return (
    <div>
      <div className="flex justify-between">
        <span className="font-semibold text-lg">Dashboard</span>
      </div>
      <div className="border rounded-lg mt-2 flex justify-between py-3 bg-secondary/20 px-5 ">
        <div className="flex flex-col ">
          <span className="text-sm text-muted-foreground">Total volume</span>
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <span className="font-semibold">${formatPrice(data!.total_volume)}</span>
          )}
        </div>
        <div className="flex flex-col  ">
          <span className="text-sm text-muted-foreground">Traders</span>
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <span className="font-semibold">{formatPrice(data!.traders)}</span>
          )}
        </div>
        <div className="flex flex-col  ">
          <span className="text-sm text-muted-foreground">Orders</span>
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <span className="font-semibold">{formatPrice(data!.orders)}</span>
          )}
        </div>
        <div className="flex flex-col ">
          <span className="text-sm text-muted-foreground">Value of Buymore</span>
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <span className="font-semibold">${formatPrice(data!.value_of_buymore)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
