"use client";

import React, { useEffect, useState, useRef } from "react";
import { BroadcastBox, Order } from "@/components/broadcast-box";
import config from "@/config";
import { useOrderFeed } from "@/hooks/use-order-feed";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderFeedListProps {
  inputToken: string;
  outputToken: string;
}

export function OrderFeedList({ inputToken, outputToken }: OrderFeedListProps) {
  const { orderFeedList, isOrderFeedListLoading, fetchOrderFeed } = useOrderFeed(
    inputToken as string,
    outputToken as string
  );

  useEffect(() => {
    fetchOrderFeed();
  }, [inputToken, outputToken]);

  return (
    <div className="flex flex-col">
      {isOrderFeedListLoading ? (
        // Loading
        <div className=" bg-accent/50 rounded-lg border border-accent text-muted-foreground text-center">
          <Skeleton className="h-[246px] w-full" title="Loading..." />
        </div>
      ) : orderFeedList.length > 0 ? (
        // Data display
        <BroadcastBox orders={orderFeedList} />
      ) : (
        // No data
        <div className="p-4 bg-accent/50 rounded-lg border border-accent text-muted-foreground text-center">
          No Data
        </div>
      )}
    </div>
  );
}
