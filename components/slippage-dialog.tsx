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
import { z } from "zod";

const slippageSchema = z
  .number()
  .min(0.01, "Slippage must be at least 0.01%")
  .max(100, "Slippage cannot exceed 100%");

interface SlippageDialogProps {
  onSlippageChange: (slippage: number) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function SlippageDialog({ onSlippageChange, open, onOpenChange }: SlippageDialogProps) {
  const [customSlippage, setCustomSlippage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSlippageSubmit = () => {
    const slippage = parseFloat(customSlippage);

    try {
      slippageSchema.parse(slippage);
      setError(null);
      onSlippageChange(slippage);
      onOpenChange(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
    }
  };

  const handleSlippageChange = (value: string) => {
    setCustomSlippage(value);
    setError(null);
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
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Input
                type="number"
                placeholder="Enter slippage %"
                value={customSlippage}
                onChange={(e) => handleSlippageChange(e.target.value)}
                className="col-span-3"
              />
              <span>%</span>
            </div>
            {error && <span className="text-destructive text-sm">{error}</span>}
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
