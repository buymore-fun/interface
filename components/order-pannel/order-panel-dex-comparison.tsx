import { Routing } from "@/components/order-pannel/market-tab";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { useRaydiumPoolInfo } from "@/hooks/use-pool-info";
import { getSymbolFromPoolInfo } from "@/lib/calc";
import { ApiV3Token } from "@raydium-io/raydium-sdk-v2";
import Image from "next/image";

interface Props {
  loading?: boolean;
  routing: Routing;
  isQuoting: boolean;
  fee: string;
  outputToken?: ApiV3Token;
}

export function OrderPanelDexComparison({ loading, routing, isQuoting, fee, outputToken }: Props) {
  return (
    <div className="px-4 flex flex-col gap-2">
      <div className="flex  items-center justify-between">
        <div className="text-sm flex items-center">
          <span className="font-medium text-muted-foreground">Dex Comparison</span>
          <TooltipWrapper content={`Results of all buy in DEX.`}>
            <Image src="/assets/token/help.svg" alt="Help" width={10} height={10} />
          </TooltipWrapper>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {routing.onlySwap ? routing.onlySwap : "--"} ${getSymbolFromPoolInfo(outputToken)}
          </span>
          {/* <div className="text-sm text-muted-foreground">999,999 $USDC</div> */}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex  gap-1">
          <div className="relative inline-block text-muted-foreground">
            <span className="font-medium">Fee </span>
            <span className="text-xs">(40% of Buymore)</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {fee} ${getSymbolFromPoolInfo(outputToken)}
        </div>
      </div>
    </div>
  );
}
