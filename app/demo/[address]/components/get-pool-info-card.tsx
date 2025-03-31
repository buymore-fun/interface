"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { raydium } from "@/lib/raydium/config";
import { useAtom } from "jotai";
import { raydiumPoolIdStorage } from "./atoms";

export function GetPoolInfoCard() {
  const [raydiumPoolId, setRaydiumPoolId] = useAtom(raydiumPoolIdStorage);
  const [allPoolInfo, setAllPoolInfo] = useState<any>(null);

  const getAllPoolInfo = async () => {
    try {
      const allPoolInfo = await raydium?.liquidity.getPoolInfoFromRpc({ poolId: raydiumPoolId });
      setAllPoolInfo(allPoolInfo);
      console.log("🚀 ~ getAllPoolInfo ~ poolInfo:", allPoolInfo);
    } catch (error) {
      console.error("Failed to get pool info:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white">Get Pool Info</CardTitle>
        <CardDescription>Get pool info</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="raydiumPoolId" className="text-white">
              Raydium Pool ID
            </Label>
            <Input
              id="raydiumPoolId"
              value={raydiumPoolId}
              onChange={(e) => setRaydiumPoolId(e.target.value)}
              placeholder="Enter Raydium pool ID"
              className="text-white"
            />
            {allPoolInfo && (
              <div className="space-y-2">
                <pre className="bg-gray-800 text-white p-2 rounded-md text-xs overflow-auto max-h-40">
                  {JSON.stringify(allPoolInfo, null, 2)}
                </pre>
              </div>
            )}
          </div>
          <Button onClick={getAllPoolInfo} className="w-full" variant="default">
            Get Pool Info
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
