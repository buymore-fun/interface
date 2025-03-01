"use client";

import { Button } from "./ui/button";
import { Check, Clipboard } from "lucide-react";

import { formatNumber, cn } from "@/lib/utils";

import { SOL_ADDRESS } from "@/lib/constants";
import { useToken } from "@/hooks/use-token";
import { Skeleton } from "./ui/skeleton";
import { useClipboard } from "@/hooks/use-clipboard";
import { ellipseMiddle } from "@/lib/utils";
import { TokenIcon } from "./token-icon";
import { ChartType } from "@/types/chart";

export function TokenInfo({
  tokenAddress,
  onTypeChange,
  type,
}: {
  tokenAddress: string;
  type: ChartType;
  onTypeChange: (type: ChartType) => void;
}) {
  const token = useToken(tokenAddress);
  const SOL = useToken(SOL_ADDRESS);

  const { hasCopied, onCopy } = useClipboard(tokenAddress);

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        {token ? (
          <TokenIcon token={token} />
        ) : (
          <Skeleton className="size-8 rounded-full" />
        )}
        <div className="flex flex-col">
          <div className="flex space-x-2 items-center">
            {token && SOL ? (
              <span className="font-semibold">
                {token.symbol}/{SOL.symbol}
              </span>
            ) : (
              <Skeleton className="h-6 w-24" />
            )}
            {token ? (
              <span
                className={cn(
                  "text-xs",
                  token.priceChange24h >= 0
                    ? "text-[#9ad499]"
                    : "text-[#de5569]"
                )}
              >
                ${formatNumber(token.priceUsd)}
              </span>
            ) : null}
          </div>
          <div className="space-x-1 flex items-center">
            <span className="text-xs text-muted-foreground">
              {ellipseMiddle(tokenAddress)}
            </span>
            <Button
              variant="ghost"
              className="w-5 h-5 p-0 text-muted-foreground hover:text-foreground"
              onClick={onCopy}
            >
              {hasCopied ? (
                <Check className="size-3" />
              ) : (
                <Clipboard className="size-3" />
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        {Object.values(ChartType).map((chartType) => (
          <Button
            variant={type === chartType ? "secondary" : "outline"}
            size="xs"
            className={type !== chartType ? "text-muted-foreground" : "'"}
            onClick={() => onTypeChange(chartType)}
            key={chartType}
          >
            {chartType}
          </Button>
        ))}
      </div>
    </div>
  );
}
