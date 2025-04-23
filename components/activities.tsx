import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletAuth } from "@/components/wallet-auth";
import { getExplorerUrlFromTransaction } from "@/config";
import { useHybirdTradeProgram } from "@/hooks/hybird-trade/hybird-trade-data-access";
import { useCancelPoolInfo, useServicePoolInfo } from "@/hooks/use-pool-info";
import { useActivities, useMyOrders, useTradeHistory } from "@/hooks/use-activities";
import { getCpmmPoolFetchOne } from "@/hooks/services";
import React from "react";

import {
  cn,
  formatAddress,
  formatNumber,
  formatNumberCompact,
  formatPrice,
  formatTime,
  formatTimeAgo,
} from "@/lib/utils";
import { IMyOrderItem } from "@/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BN } from "@coral-xyz/anchor";
import { toast } from "react-hot-toast";
import Decimal from "decimal.js";

export const defaultSymbol = "T";

export function Activities({ inputMint, outputMint }: { inputMint: string; outputMint: string }) {
  const [activeTab, setActiveTab] = React.useState("myOrder");

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs defaultValue="myOrder" onValueChange={handleTabChange}>
      <TabsList className="w-full bg-transparent justify-start gap-8 flex mb-4 border-b-[0.5px] border-muted-foreground rounded-none">
        <TabsTrigger
          value="activity"
          className={cn(
            "px-0 text-lg font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:w-0 data-[state=active]:after:w-full after:transition-all after:duration-300 after:ease-in-out"
          )}
        >
          Activity
        </TabsTrigger>
        <TabsTrigger
          value="myOrder"
          className={cn(
            "px-0 text-lg font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:w-0 data-[state=active]:after:w-full after:transition-all after:duration-300 after:ease-in-out"
          )}
        >
          My order
        </TabsTrigger>
        <TabsTrigger
          value="history"
          className={cn(
            "px-0 text-lg font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:w-0 data-[state=active]:after:w-full after:transition-all after:duration-300 after:ease-in-out"
          )}
        >
          Trade History
        </TabsTrigger>
      </TabsList>
      <TabsContent value="activity">
        {activeTab === "activity" && (
          <ActivitiesList inputMint={inputMint} outputMint={outputMint} />
        )}
      </TabsContent>
      <TabsContent value="myOrder">
        <WalletAuth>
          {activeTab === "myOrder" && <MyOrders inputMint={inputMint} outputMint={outputMint} />}
        </WalletAuth>
      </TabsContent>
      <TabsContent value="history">
        <WalletAuth>
          {activeTab === "history" && <HistoryList inputMint={inputMint} outputMint={outputMint} />}
        </WalletAuth>
      </TabsContent>
    </Tabs>
  );
}

const ActivitiesList = ({ inputMint, outputMint }: { inputMint: string; outputMint: string }) => {
  const { activityList, isActivityListLoading, fetchActivities } = useActivities(
    inputMint as string,
    outputMint as string
  );

  if (isActivityListLoading) return <Skeleton className="h-[400px] w-full" />;

  return (
    <div className="border rounded-lg">
      <div className="grid grid-cols-12 text-muted-foreground text-xs bg-muted-foreground/15 px-3 py-2 text-white">
        <div className="col-span-1">Time</div>
        <div className="col-span-2">From</div>
        <div className="col-span-2">To</div>
        <div className="col-span-2">Routing</div>
        <div className="col-span-2">Buymore</div>
        <div className="col-span-2">Maker</div>
        <div className="col-span-1">TXN</div>
      </div>
      {activityList?.map((item, index) => (
        <div
          className="grid grid-cols-12 text-sm px-3 py-2 border-t items-center gap-0.5"
          key={index}
        >
          <div className="col-span-1">
            <span className="text-muted-foreground">{formatTime(item.time * 1000)}</span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground  text-wrap break-words">
              {item.from_amount.amount} ${item.from_amount.symbol}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground  text-wrap break-words">
              {item.to_amount.amount} ${item.to_amount.symbol}
            </span>
          </div>
          <div className="col-span-2 flex flex-col">
            <span className="text-muted-foreground text-xs">
              Dex: {item.routing.dec}% <br /> Order: {item.routing.order}%
            </span>
          </div>
          <div className="col-span-2">
            {/* className={''} */}
            <span className="text-muted-foreground  text-wrap break-words">
              {item.buymore_amount.amount} ${item.buymore_amount.symbol}
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
      {activityList?.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No activities found.</div>
      )}
    </div>
  );
};

const MyOrders = ({ inputMint, outputMint }: { inputMint: string; outputMint: string }) => {
  const { myOrderList, isMyOrderListLoading, myOrderListError, fetchMyOrders } = useMyOrders(
    inputMint as string,
    outputMint as string
  );

  const hybirdTradeProgram = useHybirdTradeProgram();
  const { servicePoolInfo, isServicePoolInfoLoading } = useServicePoolInfo();
  const { cancelPoolInfo, isCancelPoolInfoLoading, fetchCancelPoolInfo } = useCancelPoolInfo();
  const [cancelTx, setCancelTx] = useState<string>("");

  if (isMyOrderListLoading || isServicePoolInfoLoading)
    return <Skeleton className="h-[400px] w-full" />;

  const handleCancelOrder = async (item: IMyOrderItem) => {
    try {
      setCancelTx(item.tx);

      const poolInfoResponse = await getCpmmPoolFetchOne({
        mint_a: item.from_amount.address,
        mint_b: item.to_amount.address,
      });

      if (!poolInfoResponse) {
        throw new Error("Failed to fetch pool info");
      }

      await fetchCancelPoolInfo(item.from_amount.address, item.to_amount.address);

      console.log("🚀 ~ handleCancelOrder ~ item:", item);
      console.log("🚀 ~ handleCancelOrder ~ poolInfo:", poolInfoResponse);
      console.log(
        "🚀 ~ handleCancelOrder ~ ",
        new BN(item.pool_id),
        new BN(item.order_id),
        item.from_amount.address
      );

      await hybirdTradeProgram.cancel_order(
        new BN(item.pool_id),
        new BN(item.order_id),
        item.from_amount.address,
        poolInfoResponse
      );
    } catch (error: any) {
      toast.error("Failed to cancel order");
      console.log(error?.message);
    } finally {
      setCancelTx("");
    }
  };

  return (
    <div className="border rounded-lg">
      <div className="grid grid-cols-12 text-muted-foreground text-xs bg-muted-foreground/15 px-3 py-2 text-white gap-1">
        <div className="col-span-2">Time</div>
        <div className="col-span-2">From</div>
        <div className="col-span-2">To</div>
        <div className="col-span-2">Receive</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-1">TXN</div>
        <div className="col-span-1"></div>
      </div>
      {myOrderList?.map((item, index) => (
        <div
          className="grid grid-cols-12 text-sm px-3 py-2 border-t gap-1 items-center"
          key={index}
        >
          <div className="col-span-2">
            <span className="text-muted-foreground">{formatTime(item.time * 1000)}</span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground  text-wrap break-words">
              {item.from_amount.amount} ${item.from_amount.symbol || defaultSymbol}
            </span>
          </div>
          <div className="col-span-2">
            <span className={"text-muted-foreground  text-wrap break-words"}>
              {item.to_amount.amount} ${item.to_amount.symbol || defaultSymbol}
            </span>
          </div>
          <div className="col-span-2">
            <span className={"text-muted-foreground  text-wrap break-words"}>
              {item.receive_amount.amount}${item.receive_amount.symbol || defaultSymbol}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">${formatPrice(item.price, 3)}</span>
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
              disabled={cancelTx === item.tx}
              onClick={() => {
                handleCancelOrder(item);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ))}
      {myOrderList?.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No active orders found.</div>
      )}
    </div>
  );
};

export const HistoryList = ({
  inputMint,
  outputMint,
}: {
  inputMint: string;
  outputMint: string;
}) => {
  const { publicKey } = useWallet();

  const { tradeHistoryList, isTradeHistoryListLoading, tradeHistoryListError, fetchTradeHistory } =
    useTradeHistory(inputMint as string, outputMint as string);

  if (isTradeHistoryListLoading) return <Skeleton className="h-[400px] w-full" />;

  return (
    <div className="border rounded-lg">
      <div className="grid grid-cols-12 text-muted-foreground text-xs bg-muted-foreground/15 px-3 py-2 text-white gap-1">
        <div className="col-span-2">Time</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-2">From</div>
        <div className="col-span-2">To</div>
        <div className="col-span-2">Price</div>
        {/* <div className="col-span-2">Routing</div> */}
        <div className="col-span-2">Buymore</div>
        <div className="col-span-1">TXN</div>
      </div>
      {tradeHistoryList?.map((item, index) => (
        <div
          className="grid grid-cols-12 text-sm px-3 py-2 border-t items-center gap-1"
          key={index}
        >
          {/* time  */}
          <div className="col-span-2">
            <span className="text-muted-foreground">{formatTime(item.time * 1000)}</span>
          </div>
          <div className="col-span-1">
            <span
              className={`capitalize ${
                item.order_type === "market" ? "text-primary" : "text-white"
              }`}
            >
              {item.order_type}
            </span>
          </div>

          <div className="col-span-2">
            <span className="text-muted-foreground  text-wrap break-words">
              {item.from_amount.amount} ${item.from_amount.symbol || defaultSymbol}
            </span>
          </div>
          {/* amount */}
          <div className="col-span-2">
            <span className="text-muted-foreground  text-wrap break-words">
              {item.to_amount.amount} ${item.to_amount.symbol || defaultSymbol}
            </span>
          </div>
          {/* price */}
          <div className="col-span-2">
            <span className="text-muted-foreground">${formatNumber(item.price)}</span>
          </div>
          {/* routing */}
          {/* <div className="col-span-2">
            <span className="text-muted-foreground text-xs">
              Dex: {item.routing.dec} <br />
              Order: {item.routing.order}%
            </span>
          </div> */}
          {/* buymore */}
          <div className="col-span-2">
            <span className="text-muted-foreground  text-wrap break-words">
              {item.buymore_amount.amount
                ? `${item.buymore_amount.amount} 
                $${item.buymore_amount.symbol || defaultSymbol}`
                : "-"}
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
      {tradeHistoryList?.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No trade history found.</div>
      )}
    </div>
  );
};
