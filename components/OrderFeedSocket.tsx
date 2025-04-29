"use client";

import React, { useEffect, useState, useRef } from "react";
import { BroadcastBox, Order } from "@/components/broadcast-box";
import { formatTimeAgo } from "@/lib/utils";

interface OrderFeedSocketProps {
  inputToken: string;
  outputToken: string;
  maxOrders?: number;
}

// Define the actual response format from the WebSocket
interface OrderResponse {
  event: string;
  token_0_mint: string;
  token_1_mint: string;
  data: {
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
  }[];
}
// React hook for updating time display every second
export function useCountdownTimer(timestamp: number | string | Date): string {
  const [timeAgo, setTimeAgo] = useState<string>(formatTimeAgo(timestamp));

  useEffect(() => {
    // Update time immediately
    setTimeAgo(formatTimeAgo(timestamp));

    // Update time every second
    const intervalId = setInterval(() => {
      setTimeAgo(formatTimeAgo(timestamp));
    }, 1000);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [timestamp]);

  return timeAgo;
}

export function OrderFeedSocket({ inputToken, outputToken, maxOrders = 3 }: OrderFeedSocketProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const webSocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    const connectWebSocket = () => {
      try {
        // Clean up previous connection if exists
        if (webSocketRef.current) {
          webSocketRef.current.close();
        }

        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }

        // Create a direct WebSocket connection
        const encodedInputToken = encodeURIComponent(inputToken);
        const encodedOutputToken = encodeURIComponent(outputToken);

        // 使用wss协议，确保与提供的地址格式匹配
        const wsUrl = `wss://api-test.buymore.fun/usurper/order-feed/subscribe?input_token=${encodedInputToken}&output_token=${encodedOutputToken}`;

        console.log("Connecting to WebSocket:", wsUrl);
        const ws = new WebSocket(wsUrl);
        webSocketRef.current = ws;

        // WebSocket event handlers
        ws.onopen = () => {
          console.log("WebSocket connection established");
          setIsConnected(true);
          setConnectionError(null);
        };

        ws.onmessage = (event) => {
          try {
            console.log("Received WebSocket message:", event.data);
            const response: OrderResponse = JSON.parse(event.data);

            // Check if it's a message event with order data
            if (response.event === "message" && Array.isArray(response.data)) {
              const newOrders = response.data.map((item) => ({
                time: item.time,
                order_type: item.order_type,
                order_amount: item.order_amount,
                owner: item.owner,
                price: item.price,
              }));

              // Update orders state with the new orders
              setOrders((prevOrders) => {
                // Combine new orders with existing ones and limit to maxOrders
                const combinedOrders = [...newOrders, ...prevOrders];

                // Remove duplicates by checking owner and time
                const uniqueOrders = combinedOrders.filter(
                  (order, index, self) =>
                    index ===
                    self.findIndex((o) => o.owner === order.owner && o.time === order.time)
                );

                return uniqueOrders.slice(0, maxOrders);
              });
            }
          } catch (error) {
            console.error("Error processing WebSocket message:", error);
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setConnectionError("WebSocket connection error");
          setIsConnected(false);
        };

        ws.onclose = (event) => {
          console.log("WebSocket connection closed:", event.code, event.reason);
          setIsConnected(false);

          // Attempt to reconnect after a delay
          if (!event.wasClean) {
            setConnectionError(`Connection closed unexpectedly (Code: ${event.code})`);
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log("Attempting to reconnect...");
              connectWebSocket();
            }, 5000);
          }
        };

        // Send a ping every 30 seconds to keep the connection alive
        const pingInterval = setInterval(() => {
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, 30000);

        return () => {
          clearInterval(pingInterval);
        };
      } catch (error) {
        console.error("Error setting up WebSocket:", error);
        setConnectionError("Failed to connect to WebSocket");
        setIsConnected(false);

        // Attempt to reconnect after a delay
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("Attempting to reconnect after error...");
          connectWebSocket();
        }, 5000);
      }
    };

    // Initialize connection
    connectWebSocket();

    // Cleanup function
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [inputToken, outputToken, maxOrders]);

  return (
    <div className="flex flex-col">
      {/* Connection status indicator */}
      {/* <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <span className="text-xs text-muted-foreground">
            {isConnected
              ? "Connected to order feed"
              : connectionError || "Connecting to order feed..."}
          </span>
        </div>
      </div> */}

      {orders.length > 0 ? (
        <BroadcastBox orders={orders} />
      ) : (
        <div className="p-4 bg-accent/50 rounded-lg border border-accent text-muted-foreground text-center">
          {isConnected ? "Waiting for orders..." : null}
        </div>
      )}
    </div>
  );
}
