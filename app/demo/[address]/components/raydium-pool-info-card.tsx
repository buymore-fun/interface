"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { raydium } from "@/lib/raydium/config";
import { NATIVE_MINT } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { PoolsApiReturn } from "@raydium-io/raydium-sdk-v2";
import { useAtom } from "jotai";
import { tokenMintAddressStorage } from "./atoms";

export function RaydiumPoolInfoCard() {
  const [tokenMintAddress, setTokenMintAddress] = useAtom(tokenMintAddressStorage);
  const [poolByMints, setPoolByMints] = useState<PoolsApiReturn>();

  const fetchPoolByMints = async () => {
    try {
      const poolByMints = await raydium?.api.fetchPoolByMints({
        mint1: NATIVE_MINT,
        mint2: new PublicKey(tokenMintAddress),
      });

      console.log("🚀 ~ fetchPoolByMints ~ poolByMints:", poolByMints);
      setPoolByMints(poolByMints);
    } catch (error) {
      console.error("Failed to fetch pool by mints:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white">Raydium Pool By Mint Address</CardTitle>
        <CardDescription>Raydium pool info by mint address</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tokenMintAddress" className="text-white">
              Token Mint Address
            </Label>
            <Input
              id="tokenMintAddress"
              value={tokenMintAddress}
              onChange={(e) => setTokenMintAddress(e.target.value)}
              placeholder="Enter token mint address"
              className="text-white"
            />
          </div>
          {poolByMints && (
            <div className="mt-4 p-4 bg-gray-800 rounded-md overflow-auto max-h-96">
              <pre className="text-xs text-white whitespace-pre-wrap">
                {JSON.stringify(poolByMints, null, 2)}
              </pre>
            </div>
          )}
          <Button onClick={fetchPoolByMints} className="w-full" variant="default">
            Fetch Pool By Mint Address
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
