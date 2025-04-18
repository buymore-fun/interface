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
  const [activeTab, setActiveTab] = React.useState("myOrders");

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs defaultValue="myOrders" onValueChange={handleTabChange}>
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
        {activeTab === "activities" && (
          <ActivitiesList inputMint={inputMint} outputMint={outputMint} />
        )}
      </TabsContent>
      <TabsContent value="myOrders">
        <WalletAuth>
          {activeTab === "myOrders" && <MyOrders inputMint={inputMint} outputMint={outputMint} />}
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
      <div className="grid grid-cols-12 text-muted-foreground text-xs bg-secondary/30 px-3 py-2 text-white">
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
            <span className="text-muted-foreground">
              {Decimal(item.from_amount.amount)
                .div(new Decimal(10).pow(item.from_amount.decimal))
                .toString()}{" "}
              ${item.from_amount.symbol}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">
              {Decimal(item.to_amount.amount)
                .div(new Decimal(10).pow(item.to_amount.decimal))
                .toString()}{" "}
              ${item.to_amount.symbol}
            </span>
          </div>
          <div className="col-span-2 flex flex-col">
            <span className="text-muted-foreground text-xs">
              Dex: {item.routing.dec}% <br /> Order: {item.routing.order}%
            </span>
          </div>
          <div className="col-span-2">
            {/* className={cn(item.type === "sell" ? "text-[#9ad499]" : "text-[#D8697E]")} */}
            <span className="text-muted-foreground">
              {Decimal(item.buymore_amount.amount)
                .div(new Decimal(10).pow(item.buymore_amount.decimal))
                .toString()}{" "}
              ${item.buymore_amount.symbol}
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
        mint_a: item.amount.coin_token,
        mint_b: item.receive.coin_token,
      });

      if (!poolInfoResponse) {
        throw new Error("Failed to fetch pool info");
      }

      await fetchCancelPoolInfo(item.amount.coin_token, item.receive.coin_token);

      console.log("🚀 ~ handleCancelOrder ~ item:", item);
      console.log("🚀 ~ handleCancelOrder ~ poolInfo:", poolInfoResponse);
      console.log(
        "🚀 ~ handleCancelOrder ~ ",
        new BN(item.pool_id),
        new BN(item.order_id),
        item.amount.coin_token
      );

      await hybirdTradeProgram.cancel_order(
        new BN(item.pool_id),
        new BN(item.order_id),
        item.amount.coin_token,
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
      <div className="grid grid-cols-12 text-muted-foreground text-xs bg-secondary/30 px-3 py-2 text-white">
        <div className="col-span-2">Time</div>
        <div className="col-span-2">From</div>
        <div className="col-span-2">To</div>
        <div className="col-span-2">Receive</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-1">Txn</div>
        <div className="col-span-1"></div>
      </div>
      {myOrderList?.map((item, index) => (
        <div className="grid grid-cols-12 text-sm px-3 py-2 border-t" key={index}>
          <div className="col-span-2">
            <span className="text-muted-foreground">{formatTime(item.time * 1000)}</span>
          </div>
          <div className="col-span-2">
            <span className={cn(item.type === "sell" ? "text-[#D8697E]" : "text-[#9ad499]")}>
              {Decimal(item.amount.place_order_amount)
                .div(new Decimal(10).pow(item.input_token_decimal))
                .toString()}{" "}
              ${item.amount.symbol || defaultSymbol}
            </span>
          </div>
          <div className="col-span-2">
            <span className={"text-muted-foreground"}>
              {Decimal(item.amount.used_order_amount)
                .div(new Decimal(10).pow(item.input_token_decimal))
                .toString()}{" "}
              ${item.receive.symbol || defaultSymbol}
            </span>
          </div>
          <div className="col-span-2">
            <span className={"text-muted-foreground"}>
              {Decimal(item.receive.amount)
                .div(new Decimal(10).pow(item.output_token_decimal))
                .toString()}
              ${item.receive.symbol || defaultSymbol}
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
      <div className="grid grid-cols-12 text-muted-foreground text-xs bg-secondary/30 px-3 py-2 text-white">
        <div className="col-span-2">Time</div>
        <div className="col-span-2">From</div>
        <div className="col-span-2">To</div>
        <div className="col-span-2">Price</div>
        {/* <div className="col-span-2">Routing</div> */}
        <div className="col-span-2">Buymore</div>
        <div className="col-span-2">Txn</div>
      </div>
      {tradeHistoryList?.map((item, index) => (
        <div className="grid grid-cols-12 text-sm px-3 py-2 border-t items-center" key={index}>
          {/* time  */}
          <div className="col-span-2">
            <span className="text-muted-foreground">{formatTime(item.time * 1000)}</span>
          </div>
          {/* type */}
          <div className="col-span-2">
            <span className={cn(item.type === "sell" ? "text-[#D8697E]" : "text-[#9ad499]")}>
              {Decimal(item.amount.amount)
                .div(new Decimal(10).pow(item.input_token_decimal))
                .toString()}{" "}
              ${item.amount.symbol || defaultSymbol}
            </span>
          </div>
          {/* amount */}
          <div className="col-span-2">
            <span className={cn(item.type === "sell" ? "text-[#9ad499]" : "text-[#D8697E]")}>
              {Decimal(item.receive.amount)
                .div(new Decimal(10).pow(item.output_token_decimal))
                .toString()}{" "}
              ${item.receive.symbol || defaultSymbol}
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
            <span className="text-muted-foreground">
              {item.buymore.amount
                ? `${Decimal(item.buymore.amount)
                    .div(new Decimal(10).pow(item.output_token_decimal))
                    .toString()} 
                $${item.buymore.symbol || defaultSymbol}`
                : "-"}
            </span>
          </div>
          {/* txn */}
          <div className="col-span-2">
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
