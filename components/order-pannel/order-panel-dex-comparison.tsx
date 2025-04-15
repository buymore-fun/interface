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
  outputToken?: ApiV3Token;
}

export function OrderPanelDexComparison({ loading, routing, isQuoting, outputToken }: Props) {
  return (
    <div className="px-4 flex flex-col gap-2">
      {/* <div className="flex  items-center justify-between">
        <div className="text-sm flex items-center gap-1">
          <span className="font-medium text-muted-foreground">Dex Comparison</span>
          <TooltipWrapper content={`Results of all buy in DEX.`}>
            <Image src="/assets/token/help.svg" alt="Help" width={10} height={10} />
          </TooltipWrapper>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {routing.onlySwap ? routing.onlySwap : "--"} ${getSymbolFromPoolInfo(outputToken)}
          </span>
        </div>
      </div> */}

      <div className="flex  items-center justify-between ">
        <div className="text-sm flex items-center gap-1">
          <span className="font-medium text-muted-foreground">Dex Comparison</span>
          <TooltipWrapper content={`Results of all buy in DEX.`}>
            <Image src="/assets/token/help.svg" alt="Help" width={10} height={10} />
          </TooltipWrapper>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {routing.onlySwap ? routing.onlySwap : "--"} ${getSymbolFromPoolInfo(outputToken)}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between ">
        <div className="text-sm flex items-center gap-1">
          <span className="font-medium text-muted-foreground">Min Receive</span>
          <TooltipWrapper
            content={`Results of all buy in AMM. Under extreme conditions, the minimum attainable value on buymore.fun`}
          >
            <Image src="/assets/token/help.svg" alt="Help" width={10} height={10} />
          </TooltipWrapper>
        </div>
        <span className="text-muted-foreground text-sm">
          {routing.minReceive || "--"} ${getSymbolFromPoolInfo(outputToken)}
        </span>
      </div>
      <div className="flex items-center justify-between ">
        <div className="text-sm flex items-center gap-1">
          <span className="font-medium text-muted-foreground">Max Receive</span>
          <TooltipWrapper
            content={`The maximum attainable value, including in orderbook liquidity on buymore.fun`}
          >
            <Image src="/assets/token/help.svg" alt="Help" width={10} height={10} />
          </TooltipWrapper>
        </div>
        <span className="text-muted-foreground text-sm">
          {routing.maxReceive || "--"} ${getSymbolFromPoolInfo(outputToken)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex  gap-1">
          <div className="relative inline-block text-muted-foreground">
            <span className="font-medium">Fee </span>
            <span className="text-xs">(40% of Buymore)</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {+routing.fee} ${getSymbolFromPoolInfo(outputToken)}
        </div>
      </div>
    </div>
  );
}
