import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WalletAuth } from "@/components/wallet-auth";
import { getExplorerUrlFromTransaction } from "@/config";
import { useHybirdTradeProgram } from "@/hooks/hybird-trade/hybird-trade-data-access";
import { useCancelPoolInfo, useRaydiumPoolInfo, useServicePoolInfo } from "@/hooks/use-pool-info";
import { useActivities, useMyOrders, useTradeHistory } from "@/hooks/use-activities";
import { getCpmmPoolFetchOne } from "@/hooks/services";
import React from "react";

import { cn, formatAddress, formatNumber, formatPrice, formatTime } from "@/lib/utils";
import { IMyOrderItem } from "@/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { BN } from "@coral-xyz/anchor";
// import { toast } from "react-hot-toast";
import { useCommonToast } from "@/hooks/use-common-toast";
import { useSolBalance } from "@/hooks/use-sol-balance";
import { useTokenBalanceV2 } from "@/hooks/use-sol-balance";

export const defaultSymbol = "T";

export function Activities({ inputMint, outputMint }: { inputMint: string; outputMint: string }) {
  const [activeTab, setActiveTab] = React.useState("myOrder");
  const [showHistoryDot, setShowHistoryDot] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasClickedHistory = localStorage.getItem("hasClickedHistory") === "true";
      setShowHistoryDot(!hasClickedHistory);
    }
  }, []);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);

    if (value === "history") {
      setShowHistoryDot(false);
      localStorage.setItem("hasClickedHistory", "true");
    }
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
          {showHistoryDot && (
            <span className="absolute top-2 -right-2 h-2 w-2 rounded-full bg-red-500"></span>
          )}
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
    <div className="border rounded-lg cursor-pointer">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted-foreground/15">
            <TableHead className="w-[10%]">Time</TableHead>
            <TableHead className="w-[15%]">From</TableHead>
            <TableHead className="w-[15%]">To</TableHead>
            <TableHead className="w-[15%]">Routing</TableHead>
            <TableHead className="w-[15%]">Buymore</TableHead>
            <TableHead className="w-[15%]">Maker</TableHead>
            <TableHead className="w-[5%]">TXN</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activityList?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No activities found.
              </TableCell>
            </TableRow>
          ) : (
            activityList?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-muted-foreground">
                  {formatTime(item.time * 1000)}
                </TableCell>
                <TableCell className="text-muted-foreground text-wrap break-words">
                  {item.from_amount.amount} {item.from_amount.symbol}
                </TableCell>
                <TableCell className="text-muted-foreground text-wrap break-words">
                  {item.to_amount.amount} {item.to_amount.symbol}
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-xs">
                    AMM: {item.routing.dec}% <br /> Order: {item.routing.order}%
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-wrap break-words">
                  {item.buymore_amount.amount} {item.buymore_amount.symbol}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatAddress(item.marker)}
                </TableCell>
                <TableCell>
                  <Link
                    href={getExplorerUrlFromTransaction(item.tx)}
                    className="text-muted-foreground hover:text-foreground"
                    target="_blank"
                  >
                    <ExternalLink className="size-4" />
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const MyOrders = ({ inputMint, outputMint }: { inputMint: string; outputMint: string }) => {
  const { errorToast } = useCommonToast();
  const { myOrderList, isMyOrderListLoading, myOrderListError, fetchMyOrders } = useMyOrders(
    inputMint as string,
    outputMint as string
  );
  const { solBalance, fetchSolBalance, isLoading } = useSolBalance();
  const { raydiumPoolInfo } = useRaydiumPoolInfo();

  const { tokenBalance, mutateTokenBalance } = useTokenBalanceV2(
    raydiumPoolInfo?.poolInfo.mintB.address
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
      await fetchSolBalance();
      await mutateTokenBalance();
    } catch (error: any) {
      errorToast("Operation Failed", "Failed to cancel order");
      console.log(error?.message);
    } finally {
      setCancelTx("");
    }
  };

  return (
    <div className="border rounded-lg cursor-pointer">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted-foreground/15">
            <TableHead className="w-[15%]">Time</TableHead>
            <TableHead className="w-[15%]">From</TableHead>
            <TableHead className="w-[15%]">To</TableHead>
            <TableHead className="w-[15%]">Receive</TableHead>
            <TableHead className="w-[15%]">Price</TableHead>
            <TableHead className="w-[10%]">TXN</TableHead>
            <TableHead className="w-[10%]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {myOrderList?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No active orders found.
              </TableCell>
            </TableRow>
          ) : (
            myOrderList?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-muted-foreground">
                  {formatTime(item.time * 1000)}
                </TableCell>
                <TableCell className="text-muted-foreground text-wrap break-words">
                  {item.from_amount.amount} {item.from_amount.symbol || defaultSymbol}
                </TableCell>
                <TableCell className="text-muted-foreground text-wrap break-words">
                  {item.to_amount.amount} {item.to_amount.symbol || defaultSymbol}
                </TableCell>
                <TableCell className="text-muted-foreground text-wrap break-words">
                  {item.receive_amount.amount} {item.receive_amount.symbol || defaultSymbol}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  ${formatPrice(item.price, 3)}
                </TableCell>
                <TableCell>
                  <Link
                    href={getExplorerUrlFromTransaction(item.tx)}
                    className="text-muted-foreground hover:text-foreground"
                    target="_blank"
                  >
                    <ExternalLink className="size-4" />
                  </Link>
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
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
    <div className="border rounded-lg cursor-pointer">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted-foreground/15">
            <TableHead className="w-[15%]">Time</TableHead>
            <TableHead className="w-[10%]">Type</TableHead>
            <TableHead className="w-[15%]">From</TableHead>
            <TableHead className="w-[15%]">To</TableHead>
            <TableHead className="w-[15%]">Price</TableHead>
            <TableHead className="w-[15%]">Buymore</TableHead>
            <TableHead className="w-[10%]">TXN</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tradeHistoryList?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No trade history found.
              </TableCell>
            </TableRow>
          ) : (
            tradeHistoryList?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-muted-foreground">
                  {formatTime(item.time * 1000)}
                </TableCell>
                <TableCell
                  className={`capitalize ${
                    item.order_type === "market" ? "text-primary" : "text-white"
                  }`}
                >
                  {item.order_type}
                </TableCell>
                <TableCell className="text-muted-foreground text-wrap break-words">
                  {item.from_amount.amount} {item.from_amount.symbol || defaultSymbol}
                </TableCell>
                <TableCell className="text-muted-foreground text-wrap break-words">
                  {item.to_amount.amount} {item.to_amount.symbol || defaultSymbol}
                </TableCell>
                <TableCell className="text-muted-foreground">${formatNumber(item.price)}</TableCell>
                <TableCell className="text-muted-foreground text-wrap break-words">
                  {item.buymore_amount.amount
                    ? `${item.buymore_amount.amount} 
                    ${item.buymore_amount.symbol || defaultSymbol}`
                    : "-"}
                </TableCell>
                <TableCell>
                  <Link
                    href={getExplorerUrlFromTransaction(item.tx)}
                    className="text-muted-foreground hover:text-foreground"
                    target="_blank"
                  >
                    <ExternalLink className="size-4" />
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
