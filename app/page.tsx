"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import { TableTime } from "@/types/chart";
import { TimeGroup } from "@/components/time-group";
import { useState, useEffect } from "react";

interface TokenData {
  id: number;
  token: string;
  tokenCode: string;
  baseToken: string;
  price: number;
  change: number;
  totalVolume: string;
  valueOfBuymore: string;
  activeFund: string;
  holders: string;
  icon: "zap" | "circle" | "sun" | "moon";
}

const tokenData: TokenData[] = [
  {
    id: 1,
    token: "BOB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: 1.4,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "zap",
  },
  {
    id: 2,
    token: "AOB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: -1.7,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "circle",
  },
  {
    id: 3,
    token: "COB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: 2.5,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "sun",
  },
  {
    id: 4,
    token: "DOB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: 1.5,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "zap",
  },
  {
    id: 5,
    token: "EOB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: -3.9,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "zap",
  },
  {
    id: 6,
    token: "FOB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: -1.4,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "zap",
  },
  {
    id: 7,
    token: "GOB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: 18.6,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "zap",
  },
  {
    id: 8,
    token: "HOB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: -7.9,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "zap",
  },
  {
    id: 9,
    token: "IOB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: 1.3,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "zap",
  },
  {
    id: 10,
    token: "JOB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: -2.4,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "zap",
  },
  {
    id: 11,
    token: "KOB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: 1.4,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "zap",
  },
  {
    id: 12,
    token: "LOB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: 1.4,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "zap",
  },
  {
    id: 13,
    token: "MOB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: 1.4,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "zap",
  },
  {
    id: 14,
    token: "NOB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: -1.7,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "zap",
  },
  {
    id: 15,
    token: "OOB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: 2.5,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "zap",
  },
  {
    id: 16,
    token: "POB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: 1.5,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "zap",
  },
  {
    id: 17,
    token: "QOB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: -3.9,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "zap",
  },
  {
    id: 18,
    token: "ROB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: -1.4,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "zap",
  },
  {
    id: 19,
    token: "SOB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: 18.6,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "zap",
  },
  {
    id: 20,
    token: "TOB",
    tokenCode: "SOL",
    baseToken: "FastLunmo",
    price: 67890,
    change: -7.9,
    totalVolume: "$999,766,777",
    valueOfBuymore: "$999,766,777",
    activeFund: "$999,999",
    holders: "666,777",
    icon: "zap",
  },
];

export default function Home() {
  const [tableType, setTableType] = useState<TableTime>(TableTime.ONE_HOUR);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getTokenIcon = (type: string) => {
    return <Zap className="h-5 w-5 text-yellow-400" />;
  };

  return (
    <div className="relative w-full">
      {isMounted && (
        <div
          className="absolute top-0 left-0 right-0 w-screen h-screen overflow-hidden hidden md:block"
          style={{ left: "50%", transform: "translateX(-50%)" }}
        >
          <div className="bg-[url('/home-bg.png')] bg-contain bg-top h-full w-full bg-no-repeat"></div>
        </div>
      )}
      <div className="min-h-scree text-white overflow-hidden relative">
        <div className="container mx-auto px-4 md:py-16 py-4 relative z-10">
          <div className="flex flex-col mx-8">
            <div className="my-10 md:text-center">
              <img src="/home-title.png" alt="title" className="object-cover" />
              <p className="text-lg lg:text-3xl max-w-4xl text-white text-shadow-sm text-shadow-primary font-semibold leading-10 tracking-widest mx-auto">
                A Community driven hybrid trading DEX that aggregates the liquidity of AMM and
                Orderbook.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 mb-16">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground  md:text-2xl">Total volume</span>
                <span className="font-semibold md:text-[28px]">${"999,766"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground  md:text-2xl">Traders</span>
                <span className="font-semibold md:text-[28px]">{"999,999"}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground  md:text-2xl">Orders</span>
                <span className="font-semibold md:text-[28px]">{"999,888"}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground  md:text-2xl">Value of Buymore</span>
                <span className="font-semibold md:text-[28px]">${"999,999,666"}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end mb-4">
            <TimeGroup
              typeObject={TableTime}
              onTypeChange={(type) => setTableType(type as TableTime)}
              selectedType={tableType}
            />
          </div>

          <div className="overflow-x-auto rounded-lg border-[0.5px] border-muted-foreground/20">
            <Table className="w-full rounded-lg">
              <TableHeader className="bg-muted-foreground/15  border-b border-muted-foreground/20 ">
                <TableRow>
                  <TableHead className="text-white font-medium text-center">#</TableHead>
                  <TableHead className="text-white font-medium text-center">Token</TableHead>
                  <TableHead className="text-white font-medium">Price</TableHead>
                  <TableHead className="text-white font-medium">Total volume</TableHead>
                  <TableHead className="text-white font-medium">Value of Buymore</TableHead>
                  <TableHead className="text-white font-medium">Active fund</TableHead>
                  <TableHead className="text-white font-medium">Holders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokenData.map((token) => (
                  <TableRow
                    key={token.id}
                    className="border-b border-muted-foreground/20 hover:bg-muted-foreground/10 transition-colors cursor-pointer"
                  >
                    <TableCell
                      className={`text-muted-foreground ${+token.id <= 3 ? "text-yellow-400" : ""} font-medium  text-center`}
                    >
                      {token.id}
                    </TableCell>
                    <TableCell className="flex items-center justify-center">
                      <div className="flex items-center">
                        {getTokenIcon(token.icon)}
                        <div className="ml-2">
                          <div className="font-medium">
                            <span
                              className={`${+token.id <= 3 ? "text-yellow-400" : "text-white"}`}
                            >
                              {token.token}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              /{token.tokenCode}
                            </span>
                          </div>
                          <div className="text-muted-foreground text-sm">{token.baseToken}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-muted-foreground">
                        ${token.price.toLocaleString()}
                      </div>
                      <div
                        className={cn(
                          "text-sm",
                          token.change > 0 ? "text-[#9ad499]" : "text-[#de5569]"
                        )}
                      >
                        {token.change > 0 ? "+" : ""}
                        {token.change}%
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-muted-foreground">
                      {token.totalVolume}
                    </TableCell>
                    <TableCell className="font-medium text-muted-foreground">
                      {token.valueOfBuymore}
                    </TableCell>
                    <TableCell className="font-medium text-muted-foreground">
                      {token.activeFund}
                    </TableCell>
                    <TableCell className="font-medium text-muted-foreground">
                      {token.holders}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
