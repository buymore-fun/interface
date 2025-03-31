"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useHybirdTradeProgram } from "@/hooks/hybird-trade/hybird-trade-data-access";

export function InitializePoolCard() {
  const { address } = useParams();
  const [initializingPool, setInitializingPool] = useState(false);

  const hybirdTradeProgram = useHybirdTradeProgram(address as string);

  const handleInitializePool = async () => {
    setInitializingPool(true);
    try {
      await hybirdTradeProgram.initializePool(10);
    } catch (error) {
      console.error("Failed to initialize pool:", error);
    } finally {
      setInitializingPool(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white">Initialize Pool</CardTitle>
        <CardDescription>Create a new trading pool with a custom amount</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="poolAmount" className="text-white">
              Pool amount ( 10 )
            </Label>
          </div>
          <Button onClick={handleInitializePool} className="w-full">
            {initializingPool ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              "Initialize Pool"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
