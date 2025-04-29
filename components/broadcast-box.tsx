"use client";

import React from "react";
import { cn, formatAddress } from "@/lib/utils";
import { useCountdownTimer } from "./OrderFeedSocket";
export interface Order {
  time: number;
  order_type: string;
  order_amount: {
    amount: string;
    name: string;
    address: string;
    symbol: string;
    decimal: number;
  };
  owner: string;
  price: string;
}

interface BroadcastBoxProps {
  orders: Order[];
}

// Separate component for each order item to properly use hooks
function OrderItem({ order, isHighlighted }: { order: Order; isHighlighted: boolean }) {
  // Use the countdown timer hook for real-time updates
  const timeDisplay = useCountdownTimer(order.time * 1000);

  return (
    <div
      className={cn(
        "bg-accent/95 rounded-lg p-2 border-[0.5px] border-accent shadow-sm cursor-pointer",
        isHighlighted ? "shadow-primary border-primary" : ""
      )}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span
            className={cn(
              "text-xs font-bold px-2 py-0.5 rounded capitalize",
              order.order_type == "buy"
                ? "bg-green-500/20 text-[#9ad499]"
                : "bg-red-500/20 text-[#de5569]"
            )}
          >
            {order.order_type}
          </span>
          <span className="text-muted-foreground ml-2 text-xs">{timeDisplay}</span>
        </div>
        <span className={cn("text-sm", isHighlighted ? "text-white" : "text-muted-foreground")}>
          {formatAddress(order.owner)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <div className={cn("text-sm", isHighlighted ? "text-white" : "text-muted-foreground")}>
          Price:<span className="ml-1">{order.price}</span>
        </div>
        <div className={cn("text-sm", isHighlighted ? "text-white" : "text-muted-foreground")}>
          Amt:<span className="ml-1">{order.order_amount.amount}</span>
          {order.order_amount.symbol}
        </div>
      </div>
    </div>
  );
}

export function BroadcastBox({ orders }: BroadcastBoxProps) {
  return (
    <div className="space-y-2 max-h-[400px] w-[246px] overflow-y-auto">
      {orders.map((order, index) => (
        <OrderItem key={order.time} order={order} isHighlighted={index === 0} />
      ))}
    </div>
  );
}
