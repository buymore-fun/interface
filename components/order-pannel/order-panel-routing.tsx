import { TooltipWrapper } from "@/components/tooltip-wrapper";
import Image from "next/image";

export function OrderPanelRouting() {
  return (
    <div className="px-4 flex justify-between items-center mb-2">
      <div className="flex flex-col gap-1">
        <div className="text-sm ">Routing</div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">DEX: 100%</div>
          <div className="text-sm text-muted-foreground">Order: 7%</div>
        </div>
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
        <div className="text-sm text-primary/80">≈+9.999 $USDC</div>
      </div>
    </div>
  );
}
