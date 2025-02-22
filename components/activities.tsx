import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export function Activities() {
  return (
    <Tabs defaultValue="activities">
      <TabsList className="w-full bg-transparent justify-start gap-4">
        <TabsTrigger value="activities" className="px-0 text-lg font-semibold">
          Activities
        </TabsTrigger>
        <TabsTrigger value="myOrders" className="px-0 text-lg font-semibold">
          My orders
        </TabsTrigger>
        <TabsTrigger value="history" className="px-0 text-lg font-semibold">
          History
        </TabsTrigger>
      </TabsList>
      <TabsContent value="activities">
        <div className="border rounded-lg">
          <div className="grid grid-cols-11 text-muted-foreground text-xs bg-secondary/30 px-3 py-2">
            <div className="col-span-1">Time</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-1">USD</div>
            <div className="col-span-1">Amount</div>
            <div className="col-span-2">Routing</div>
            <div className="col-span-2">Buymore</div>
            <div className="col-span-2">Maker</div>
            <div className="col-span-1">Txn</div>
          </div>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((idx) => (
            <div
              className="grid grid-cols-11 text-sm px-3 py-2 border-t"
              key={idx}
            >
              <div className="col-span-1">
                <span className="text-muted-foreground">1m</span>
              </div>
              <div className="col-span-1">
                <span className="text-[#9ad499] bg-green-100/10 px-2 py-1 rounded-lg text-xs">
                  Buy
                </span>
              </div>
              <div className="col-span-1">
                <span className="text-muted-foreground">$99.99</span>
              </div>
              <div className="col-span-1">
                <span className="text-[#9ad499]">99,999</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground text-xs">
                  Dex: 93%, Order: 7%
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[#9ad499]">99,999 SOL</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">2yTYM…7tS3Dg</span>
              </div>
              <div className="col-span-1">
                <Link
                  href=""
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="size-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="myOrders">your orders</TabsContent>
    </Tabs>
  );
}
