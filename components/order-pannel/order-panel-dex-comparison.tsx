import { TooltipWrapper } from "@/components/tooltip-wrapper";
import Image from "next/image";

export function OrderPanelDexComparison() {
  return (
    <div className="px-4 flex justify-between items-center mb-2">
      <div className="flex flex-col gap-1">
        <div className="text-sm flex items-center gap-1">
          <span className="font-medium">Dex Comparison</span>
          <TooltipWrapper content={`Results of all buy in DEX.`}>
            <Image src="/assets/token/help.svg" alt="Help" width={10} height={10} />
          </TooltipWrapper>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">999,999 $BOB</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1">
          <div className="relative inline-block">
            <span className="font-medium">Fee</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">$999(40% of Buymore)</div>
      </div>
    </div>
  );
}
