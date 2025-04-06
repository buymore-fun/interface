import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import Market from "@/public/assets/token/market.svg";
import Order from "@/public/assets/token/order.svg";
import Image from "next/image";
import { SlippageDialog } from "@/components/slippage-dialog";
import { MarketTab } from "./market-tab";
import { OrderTab } from "./order-tab";
import { useCpmmPoolFetchOne } from "@/hooks/services";
enum Tab {
  MARKET = "market",
  ORDER = "order",
}

export function OrderPanel({ poolId }: { poolId: string }) {
  const [slippageDialogOpen, setSlippageDialogOpen] = useState(false);
  // const [tab, setTab] = useState<Tab>(Tab.ORDER);
  const [tab, setTab] = useState<Tab>(Tab.MARKET);

  const { data: poolInfoData } = useCpmmPoolFetchOne({ pool_id: poolId });

  return (
    <div className="bg-card rounded-lg overflow-hidden">
      <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
        <TabsList className="w-full grid grid-cols-2 h-11 text-lg font-semibold">
          <TabsTrigger
            value={Tab.MARKET}
            className={`rounded-none ${tab === Tab.MARKET ? "bg-transparent text-foreground" : "bg-accent text-muted-foreground"}`}
          >
            <div className="flex items-center gap-2 justify-center">
              <Image src={Market} alt="Market" className="size-4" />
              Market
            </div>
          </TabsTrigger>
          <TabsTrigger
            value={Tab.ORDER}
            className={`rounded-none ${tab === Tab.ORDER ? "bg-transparent text-foreground" : "bg-accent text-muted-foreground"}`}
          >
            <div className="flex items-center gap-2 justify-center">
              <Image src={Order} alt="Order" className="size-4" />
              Order
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value={Tab.MARKET}>
          <MarketTab poolId={poolId} setSlippageDialogOpen={setSlippageDialogOpen} />
        </TabsContent>

        <TabsContent value={Tab.ORDER}>
          <OrderTab poolId={poolId} />
        </TabsContent>
      </Tabs>

      <SlippageDialog open={slippageDialogOpen} onOpenChange={setSlippageDialogOpen} />
    </div>
  );
}
