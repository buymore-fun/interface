import { Routing } from "@/components/order-pannel/market-tab";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { getSymbolFromPoolInfo } from "@/lib/calc";
import { ApiV3Token } from "@raydium-io/raydium-sdk-v2";
interface OrderPanelRoutingProps {
  routing: Routing;
  isQuoting: boolean;
  outputToken?: ApiV3Token;
}

export function OrderPanelRouting({ routing, isQuoting, outputToken }: OrderPanelRoutingProps) {
  return (
    <div className="px-4 flex flex-col-reverse mb-2 gap-2 ">
      <div className="flex justify-between items-center  gap-1">
        <div className="text-sm text-muted-foreground">Routing</div>
        {isQuoting ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <div className="flex justify-between items-center gap-2">
            <div className="text-sm text-muted-foreground">AMM: {routing.dexRatio}%</div>
            <div className="text-sm text-muted-foreground">Order: {routing.orderRatio}%</div>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center gap-1">
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
        <div className="text-sm text-primary/80">
          ≈ {routing.buyMore ? routing.buyMore : "--"} ${getSymbolFromPoolInfo(outputToken)}
        </div>
      </div>
    </div>
  );
}
