"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useHybirdTradeProgram } from "@/hooks/hybird-trade/hybird-trade-data-access";

export function CancelOrderCard() {
  const { address } = useParams();
  const [cancelingOrder, setCancelingOrder] = useState(false);
  const [orderId, setOrderId] = useState("");

  const hybirdTradeProgram = useHybirdTradeProgram(address as string);

  const handleCancelOrder = async () => {
    if (!orderId) return;
    setCancelingOrder(true);
    try {
      // await hybirdTradeProgram.cancelOrder(1, 1, +orderId);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      setCancelingOrder(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white">Cancel Order</CardTitle>
        <CardDescription>Cancel an existing order by ID</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderId" className="text-white">
              Order ID
            </Label>
            <Input
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter order ID"
              className="text-white"
            />
          </div>
          <Button
            onClick={handleCancelOrder}
            disabled={cancelingOrder || !orderId}
            className="w-full"
            variant="destructive"
          >
            {cancelingOrder ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Canceling Order...
              </>
            ) : (
              <span className="text-white">Cancel Order</span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
