import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletAuth } from "@/components/wallet-auth";
import { getExplorerUrlFromAddress, getExplorerUrlFromTransaction } from "@/config";
import { useActivityList, useMyOrderList, useTradeHistoryList } from "@/hooks/services";
import {
  cn,
  formatAddress,
  formatBalance,
  formatNumber,
  formatNumberCompact,
  formatPrice,
  formatTime,
  formatTimeAgo,
} from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export function Activities() {
  return (
    <Tabs defaultValue="myOrders">
      <TabsList className="w-full bg-transparent justify-start gap-4">
        <TabsTrigger value="activities" className="px-0 text-lg font-semibold">
          Activities
        </TabsTrigger>
        <TabsTrigger value="myOrders" className="px-0 text-lg font-semibold">
          My orders
        </TabsTrigger>
        <TabsTrigger value="history" className="px-0 text-lg font-semibold">
          Trade History
        </TabsTrigger>
      </TabsList>
      <TabsContent value="activities">
        <ActivitiesList />
      </TabsContent>
      <TabsContent value="myOrders">
        <WalletAuth>
          <MyOrders />
        </WalletAuth>
      </TabsContent>
      <TabsContent value="history">
        <WalletAuth>
          <HistoryList />
        </WalletAuth>
      </TabsContent>
    </Tabs>
  );
}

const ActivitiesList = () => {
  const { address } = useParams();

  const { data, isLoading } = useActivityList({
    inputMint: address as string,
  });

  if (isLoading) return <Skeleton className="h-[400px] w-full" />;

  return (
    <div className="border rounded-lg">
      <div className="grid grid-cols-12 text-muted-foreground text-xs bg-secondary/30 px-3 py-2">
        <div className="col-span-1">Time</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-1">USD</div>
        <div className="col-span-2">Amount</div>
        <div className="col-span-2">Routing</div>
        <div className="col-span-2">Buymore</div>
        <div className="col-span-2">Maker</div>
        <div className="col-span-1">Txn</div>
      </div>
      {data?.items?.map((item, index) => (
        <div className="grid grid-cols-12 text-sm px-3 py-2 border-t" key={index}>
          <div className="col-span-1">
            <span className="text-muted-foreground">{formatTimeAgo(item.time * 1000)}</span>
          </div>
          <div className="col-span-1">
            <span
              className={cn(
                "bg-green-100/10 px-2 py-1 rounded-lg text-xs capitalize",
                item.type === "sell" ? "text-[#D8697E]" : "text-[#9ad499]"
              )}
            >
              {item.type}
            </span>
          </div>
          <div className="col-span-1">
            <span className="text-muted-foreground">${formatNumber(item.usd)}</span>
          </div>
          <div className="col-span-2">
            <span className={cn(item.type === "sell" ? "text-[#D8697E]" : "text-[#9ad499]")}>
              {formatNumber(item.amount)}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground text-xs">
              Dex: {item.routing.dec}, Order: {item.routing.order}%
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">
              {item.buymore.amount} {item.buymore.symbol}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">{formatAddress(item.marker)}</span>
          </div>
          <div className="col-span-1">
            <Link
              href={getExplorerUrlFromTransaction(item.tx)}
              className="text-muted-foreground hover:text-foreground"
              target="_blank"
            >
              <ExternalLink className="size-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

const MyOrders = () => {
  const { publicKey } = useWallet();
  const { address } = useParams();

  const { data, isLoading } = useMyOrderList({
    inputMint: address as string,
    address: publicKey!.toBase58(),
  });

  if (isLoading) return <Skeleton className="h-[400px] w-full" />;

  return (
    <div className="border rounded-lg">
      <div className="grid grid-cols-12 text-muted-foreground text-xs bg-secondary/30 px-3 py-2">
        <div className="col-span-2">Time</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-3">Amount</div>
        <div className="col-span-2">Receive</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-1">Txn</div>
        <div className="col-span-1">Action</div>
      </div>
      {data?.items?.map((item, index) => (
        <div className="grid grid-cols-12 text-sm px-3 py-2 border-t" key={index}>
          <div className="col-span-2">
            <span className="text-muted-foreground">{formatTime(item.time * 1000)}</span>
          </div>
          <div className="col-span-1">
            <span
              className={cn(
                "bg-green-100/10 px-2 py-1 rounded-lg text-xs capitalize",
                item.type === "sell" ? "text-[#D8697E]" : "text-[#9ad499]"
              )}
            >
              {item.type}
            </span>
          </div>
          <div className="col-span-3">
            <span className={"text-muted-foreground"}>
              {formatNumber(item.amount.buy)}/{item.amount.sell} ${item.amount.symbol}
            </span>
          </div>
          <div className="col-span-2">
            <span className={"text-muted-foreground"}>
              {formatNumberCompact(item.receive.amount)} ${item.receive.symbol}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">${formatPrice(item.price)}</span>
          </div>
          <div className="col-span-1">
            <Link
              href={getExplorerUrlFromTransaction(item.tx)}
              className="text-muted-foreground hover:text-foreground"
              target="_blank"
            >
              <ExternalLink className="size-4" />
            </Link>
          </div>
          <div className="col-span-1">
            <Button
              size="xs"
              className="text-xs"
              onClick={() => console.log("Cancel order", item.id)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ))}
      {data?.total_page === 0 && (
        <div className="text-center py-8 text-muted-foreground">No active orders found.</div>
      )}
    </div>
  );
};

export const HistoryList = () => {
  const { publicKey } = useWallet();
  const { address } = useParams();

  const { data, isLoading } = useTradeHistoryList({
    inputMint: address as string,
    address: publicKey!.toBase58(),
  });

  if (isLoading) return <Skeleton className="h-[400px] w-full" />;

  return (
    <div className="border rounded-lg">
      <div className="grid grid-cols-12 text-muted-foreground text-xs bg-secondary/30 px-3 py-2">
        <div className="col-span-2">Time</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Amount</div>
        <div className="col-span-1">Price</div>
        <div className="col-span-2">Routing</div>
        <div className="col-span-2">Buymore</div>
        <div className="col-span-1">Txn</div>
      </div>
      {data?.items?.map((item, index) => (
        <div className="grid grid-cols-12 text-sm px-3 py-2 border-t" key={index}>
          {/* time  */}
          <div className="col-span-2">
            <span className="text-muted-foreground">{formatTime(item.time * 1000)}</span>
          </div>
          {/* type */}
          <div className="col-span-2">
            <span
              className={cn(
                "bg-green-100/10 px-2 py-1 rounded-lg text-xs capitalize",
                item.type === "sell" ? "text-[#D8697E]" : "text-[#9ad499]"
              )}
            >
              {item.from}/{item.type}
            </span>
          </div>
          {/* amount */}
          <div className="col-span-2">
            <span className={cn(item.type === "sell" ? "text-[#D8697E]" : "text-[#9ad499]")}>
              {item.type === "sell"
                ? formatNumber(item.amount.sell)
                : formatNumber(item.amount.buy)}
              ${item.amount.symbol}
            </span>
          </div>
          {/* price */}
          <div className="col-span-1">
            <span className="text-muted-foreground">${formatNumber(item.usd)}</span>
          </div>
          {/* routing */}
          <div className="col-span-2">
            <span className="text-muted-foreground text-xs">
              Dex: {item.routing.dec} Order: {item.routing.order}%
            </span>
          </div>
          {/* buymore */}
          <div className="col-span-2">
            <span className="text-muted-foreground">
              {item.buymore.amount ? `${item.buymore.amount} ${item.buymore.symbol}` : "-"}
            </span>
          </div>
          {/* txn */}
          <div className="col-span-1">
            <Link
              href={getExplorerUrlFromTransaction(item.tx)}
              className="text-muted-foreground hover:text-foreground"
              target="_blank"
            >
              <ExternalLink className="size-4" />
            </Link>
          </div>
        </div>
      ))}
      {data?.total_page === 0 && (
        <div className="text-center py-8 text-muted-foreground">No trade history found.</div>
      )}
    </div>
  );
};
