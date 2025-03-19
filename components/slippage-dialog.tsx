"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SlippageDialogProps {
  onSlippageChange: (slippage: number) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function SlippageDialog({ onSlippageChange, open, onOpenChange }: SlippageDialogProps) {
  const [customSlippage, setCustomSlippage] = useState("");

  const handleSlippageSubmit = () => {
    const slippage = parseFloat(customSlippage);
    if (!isNaN(slippage) && slippage > 0) {
      onSlippageChange(slippage);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="xs" className="text-muted-foreground">
          Custom
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>{`Enter your desired slippage tolerance percentage`}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Input
              type="number"
              placeholder="Enter slippage %"
              value={customSlippage}
              onChange={(e) => setCustomSlippage(e.target.value)}
              className="col-span-3"
            />
            <span>%</span>
          </div>
        </div>
        <div className="flex justify-end">
          <Button disabled={!customSlippage} onClick={handleSlippageSubmit}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
