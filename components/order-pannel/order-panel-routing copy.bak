import { Routing } from "@/components/order-pannel/market-tab";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface OrderPanelRoutingProps {
  routing: Routing;
  isQuoting: boolean;
}

export function OrderPanelRouting({ routing, isQuoting }: OrderPanelRoutingProps) {
  return (
    <div className="px-4 flex justify-between items-center mb-2">
      <div className="flex flex-col gap-1">
        <div className="text-sm ">Routing</div>
        {isQuoting ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">DEX: {routing.dexRatio}%</div>
            <div className="text-sm text-muted-foreground">Order: {routing.orderRatio}%</div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1">
          <span className="text-sm text-primary-highlight">Buymore</span>
          <div className="relative inline-block">
            <TooltipWrapper
              content={`Compared to trading directly in an AMM, you can acquire more tokens here.`}
            >
              <Image src="/assets/token/help.svg" alt="Help" width={10} height={10} />
            </TooltipWrapper>
          </div>
        </div>
        {/* <div className="text-sm text-primary/80">≈+9.999 $USDC</div> */}
        <div className="text-sm text-primary/80">≈{routing.buyMore}</div>
      </div>
    </div>
  );
}
