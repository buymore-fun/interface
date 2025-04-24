"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface Order {
  id: string;
  type: "BUY" | "SELL";
  time: string;
  address: string;
  price: string;
  amount: string;
  token: string;
}

interface BroadcastBoxProps {
  orders: Order[];
}

export function BroadcastBox({ orders }: BroadcastBoxProps) {
  return (
    <div className="space-y-2 max-h-[400px] w-[246px] overflow-y-auto">
      {orders.map((order, index) => (
        <div
          key={order.id}
          className={cn(
            "bg-accent/95 rounded-lg p-2 border-[0.5px] border-accent shadow-sm cursor-pointer",
            index === 0 ? "shadow-primary border-primary" : ""
          )}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span
                className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded",
                  order.type === "BUY"
                    ? "bg-green-500/20 text-[#9ad499]"
                    : "bg-red-500/20 text-[#de5569]"
                )}
              >
                {order.type}
              </span>
              <span className="text-muted-foreground ml-2 text-xs">{order.time}</span>
            </div>
            <span className={cn("text-sm", index === 0 ? "text-white" : "text-muted-foreground")}>
              {order.address}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className={cn("text-sm", index === 0 ? "text-white" : "text-muted-foreground")}>
              Price:<span className="ml-1">{order.price}</span>
            </div>
            <div className={cn("text-sm", index === 0 ? "text-white" : "text-muted-foreground")}>
              Amt:<span className="ml-1">{order.amount}</span> ${order.token}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
