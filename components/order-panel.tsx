import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowDownUp } from "lucide-react";

export function OrderPanel() {
  return (
    <div className="bg-card rounded-lg overflow-hidden">
      <div className="flex text-lg font-semibold">
        <div className="flex-1 h-11 flex items-center justify-center cursor-pointer">
          <span>Market</span>
        </div>
        <div className="flex-1 h-11 flex items-center justify-center text-muted-foreground bg-accent cursor-pointer">
          <span>Order</span>
        </div>
      </div>
      <div className="p-4">
        <div className="p-4 rounded-t-lg bg-accent">
          <div className="flex items-center justify-between">
            <span className="text-sm">Selling</span>
            <div className="flex space-x-2">
              <Button
                size="xs"
                variant="secondary"
                className="text-muted-foreground"
              >
                25%
              </Button>
              <Button
                size="xs"
                variant="secondary"
                className="text-muted-foreground"
              >
                50%
              </Button>
              <Button
                size="xs"
                variant="secondary"
                className="text-muted-foreground"
              >
                100%
              </Button>
            </div>
          </div>
          <div className="mt-2 flex">
            <Button variant="secondary">SOL</Button>
            <Input
              className="border-none text-lg font-semibold text-right outline-none p-0"
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="flex items-center justify-center h-0 relative">
          <Button
            size="icon"
            className="rounded-full size-8 border-2 border-accent hover:text-foreground text-muted-foreground relative z-10"
            variant="secondary"
          >
            <ArrowDownUp className="size-4" />
          </Button>
          <div className="absolute inset-x-0 top-[50%] bg-border/60 h-[1px]" />
        </div>
        <div className="p-4 rounded-b-lg bg-light-card">
          <div className="flex items-center justify-between">
            <span className="text-sm">Buying</span>
            <div className="flex space-x-2"></div>
          </div>
          <div className="mt-2 flex">
            <Button
              variant="secondary"
              className="bg-secondary/60 hover:bg-secondary/60"
            >
              SOL
            </Button>
            <Input
              className="border-none text-lg font-semibold text-right outline-none p-0"
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="my-3 text-sm flex flex-col gap-1">
          <div className="flex items-center">
            <span>Slippage</span>
          </div>
          <div className="flex items-center">
            <span>Smart Ordering</span>
          </div>
          <div className="flex items-center">
            <span>Buy More</span>
          </div>
        </div>
        <Button className="w-full" size="lg">
          Buy
        </Button>
      </div>
    </div>
  );
}
