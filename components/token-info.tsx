"use client";

import { Button } from "./ui/button";
import { Check, Clipboard } from "lucide-react";

import { formatNumber, cn, formatFloor } from "@/lib/utils";

import { SOL_ADDRESS } from "@/lib/constants";
import { useToken } from "@/hooks/use-token";
import { Skeleton } from "./ui/skeleton";
import { useClipboard } from "@/hooks/use-clipboard";
import { ellipseMiddle } from "@/lib/utils";
import { TokenIcon } from "./token-icon";
import { ChartType } from "@/types/chart";
import { TimeGroup } from "@/components/time-group";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { BroadcastBox, Order } from "@/components/broadcast-box";

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
  const [showOrders, setShowOrders] = React.useState(true);

  const [orders, setOrders] = React.useState<Order[]>([
    {
      id: "1",
      type: "SELL",
      time: "51s",
      address: "2yTYM...7tS3Dg",
      price: "999.999",
      amount: "999",
      token: "SOL",
    },
    {
      id: "2",
      type: "BUY",
      time: "52s",
      address: "2yTYM...7tS3Dg",
      price: "999.999",
      amount: "999",
      token: "BoB",
    },
    {
      id: "3",
      type: "SELL",
      time: "53s",
      address: "2yTYM...7tS3Dg",
      price: "999.999",
      amount: "999",
      token: "BoB",
    },
  ]);

  return (
    <div className="flex justify-between items-start flex-col-reverse md:flex-row gap-2">
      <div className="flex flex-col ">
        <div className="flex space-x-2 items-center text-lg">
          {token && SOL ? (
            <span className="font-semibold">
              <span className="text-primary">{token.symbol}</span>/{SOL.symbol}
            </span>
          ) : (
            <Skeleton className="h-6 w-24" />
          )}
          {token ? (
            <span className={cn(token.priceChange24h >= 0 ? "text-[#9ad499]" : "text-[#de5569]")}>
              ${formatFloor(token.priceUsd)}
            </span>
          ) : null}
          <div className="space-x-1 flex items-center">
            <span className="text-sm text-muted-foreground">{ellipseMiddle(tokenAddress)}</span>
            <Button
              variant="ghost"
              className="w-5 h-5 p-0 text-muted-foreground hover:text-foreground"
              onClick={onCopy}
            >
              {hasCopied ? (
                <Check className="size-3" />
              ) : (
                <Clipboard className="size-3 text-primary" />
              )}
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-muted-foreground text-sm">Order Feed</span>

            <div className="flex items-center space-x-2">
              <Switch
                checked={showOrders}
                onCheckedChange={setShowOrders}
                className="data-[state=unchecked]:text-muted-foreground data-[state=checked]:text-primary"
              />
            </div>
          </div>
          <div className="absolute top-8 left-0 w-full h-full z-20">
            {showOrders ? (
              orders.length > 0 ? (
                <BroadcastBox orders={orders} />
              ) : (
                <div className="text-muted-foreground text-sm">No orders found</div>
              )
            ) : null}
          </div>
        </div>
      </div>

      <TimeGroup
        typeObject={ChartType}
        onTypeChange={(type) => onTypeChange(type as ChartType)}
        selectedType={type}
        className="mr-4"
      />
    </div>
  );
}
