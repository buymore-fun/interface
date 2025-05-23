import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import Market from "@/public/assets/token/market.svg";
import Order from "@/public/assets/token/order.svg";
import Image from "next/image";
import { SlippageDialog } from "@/components/slippage-dialog";
import { MarketTab } from "./market-tab";
import { OrderTab } from "./order-tab";
import { Skeleton } from "@/components/ui/skeleton";
import { useRaydiumPoolInfo, useServicePoolInfo } from "@/hooks/use-pool-info";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

enum Tab {
  MARKET = "market",
  ORDER = "order",
}

export function OrderPanel() {
  const [slippageDialogOpen, setSlippageDialogOpen] = useState(false);
  const { servicePoolInfo } = useServicePoolInfo();

  // const [tab, setTab] = useState<Tab>(Tab.ORDER);
  const [tab, setTab] = useState<Tab>(Tab.MARKET);
  const { fetchRaydiumPoolInfo, isRaydiumLoading } = useRaydiumPoolInfo();

  useEffect(() => {
    if (servicePoolInfo?.cpmm.poolId) {
      fetchRaydiumPoolInfo(servicePoolInfo.cpmm.poolId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicePoolInfo?.cpmm.poolId]);

  return (
    <div className="bg-card rounded-lg overflow-hidden">
      {isRaydiumLoading ? (
        <Skeleton className="w-full h-[360px]" />
      ) : (
        <>
          {/* <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}> */}
          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(value as Tab);
            }}
          >
            <TabsList className="w-full grid grid-cols-2 h-11 text-lg font-semibold">
              <TabsTrigger
                value={Tab.MARKET}
                className={`rounded-none ${tab === Tab.MARKET ? "bg-transparent text-foreground" : "bg-accent text-muted-foreground"}`}
              >
                <div className="flex items-center gap-2 justify-center">
                  <Icon
                    name="market"
                    className={cn(
                      "size-4",
                      tab === Tab.MARKET ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  Market
                </div>
              </TabsTrigger>
              <TabsTrigger
                value={Tab.ORDER}
                className={`rounded-none ${tab === Tab.ORDER ? "bg-transparent text-foreground" : "bg-accent text-muted-foreground"}`}
              >
                <div className="flex items-center gap-2 justify-center">
                  <Icon
                    name="order"
                    className={cn(
                      "size-4",
                      tab === Tab.ORDER ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  Order
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value={Tab.MARKET}>
              <MarketTab
                // poolId={servicePoolInfo.cpmm.poolId}
                setSlippageDialogOpen={setSlippageDialogOpen}
              />
            </TabsContent>

            <TabsContent value={Tab.ORDER}>
              {/* <OrderTab poolId={servicePoolInfo.cpmm.poolId} /> */}
              <OrderTab />
            </TabsContent>
          </Tabs>

          <SlippageDialog open={slippageDialogOpen} onOpenChange={setSlippageDialogOpen} />
        </>
      )}
    </div>
  );
}
