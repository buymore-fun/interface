"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
interface DualRangeSliderProps {
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValues?: [number, number];
  formatValue?: (value: number) => string;
  onChange?: (values: [number, number]) => void;
  priceValue: number;
}

export function DualRangeSlider({
  className,
  min = -20,
  max = 100,
  step = 1,
  defaultValues = [-18, 80],
  formatValue = (value) => `${value > 0 ? "+" : ""}${value}%`,
  onChange,
  priceValue,
}: DualRangeSliderProps) {
  const [values, setValues] = React.useState<[number, number]>(defaultValues);

  // Calculate value based on percentage and priceValue
  const calculateDisplayValue = (percent: number): number => {
    // Calculate price based on percentage change from priceValue
    return priceValue * (1 + percent / 100);
  };

  // Handle slider value changes with snap-to-center effect
  const handleValueChange = (newValues: number[]) => {
    // Check if close to middle point (0), if so snap to 0
    const snapThreshold = 3; // Snap threshold, if value is within ±3 range, snap to 0

    const snappedValues = newValues.map((value) => {
      if (Math.abs(value) <= snapThreshold) {
        return 0;
      }
      return value;
    }) as [number, number];

    setValues(snappedValues);
    onChange?.(snappedValues);
  };

  // Calculate middle value (value corresponding to 0%)
  const middleValue = priceValue.toFixed(2);

  // Calculate percentage position of slider (for positioning middle marker)
  const middlePercent = ((0 - min) / (max - min)) * 100;

  return (
    <div className="w-full space-y-4">
      <div className="bg-light-card/80 p-3 rounded-xl w-full">
        <div className="relative pt-7 pb-6">
          <SliderPrimitive.Root
            className={cn("relative flex w-full touch-none select-none items-center", className)}
            min={min}
            max={max}
            step={step}
            value={values}
            onValueChange={handleValueChange}
            aria-label="Range"
          >
            <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-card">
              <SliderPrimitive.Range className="absolute h-full bg-primary" />
            </SliderPrimitive.Track>

            {/* Fixed middle point marker */}
            <div
              className="absolute -top-1 w-3 h-3 rounded-full bg-primary"
              style={{ left: `calc(${middlePercent}% - 6px)` }}
            ></div>

            {/* Left thumb */}
            <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full bg-primary ring-offset-card transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 -translate-y-full mb-1 p-1 rounded-full bg-primary text-white text-xs font-medium min-w-[40px] text-center">
                {formatValue(values[0])}
              </div>
            </SliderPrimitive.Thumb>

            {/* Right thumb */}
            <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full bg-primary ring-offset-card transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 -translate-y-full mb-1 p-1 rounded-full bg-primary text-white text-xs font-medium min-w-[40px] text-center">
                {formatValue(values[1])}
              </div>
            </SliderPrimitive.Thumb>
          </SliderPrimitive.Root>

          {/* Fixed endpoint labels */}
          <div className="absolute bottom-0 left-0 text-slate-500 text-[10px]">
            {formatValue(min)}
          </div>
          <div
            className="absolute bottom-0 text-slate-500 text-[10px]"
            style={{ left: `calc(${middlePercent}% - 6px)` }}
          >
            {formatValue(0)}
          </div>
          <div className="absolute bottom-0 right-0 text-slate-500 text-[10px]">
            {formatValue(max)}
          </div>
        </div>
      </div>

      {/* Bottom value display */}
      <div className="flex justify-between items-center gap-1 w-full">
        <div className="bg-light-card/80 py-2 px-2 rounded-xl text-white text-sm font-medium flex-1 text-center truncate">
          {calculateDisplayValue(values[0]).toFixed(2)}
        </div>
        <div className="text-primary">
          <Icon name="line-range" className="text-primary w-6 h-6" />
        </div>
        <div className="bg-light-card/80 py-2 px-2 rounded-xl text-gray-500 text-sm font-medium flex-1 text-center truncate">
          {middleValue}
        </div>
        <div className="text-primary">
          <Icon name="line-range" className="text-primary w-6 h-6" />
        </div>
        <div className="bg-light-card/80 py-2 px-2 rounded-xl text-white text-sm font-medium flex-1 text-center truncate shadow-md">
          {calculateDisplayValue(values[1]).toFixed(2)}
        </div>
      </div>

      <Separator className="my-3 bg-muted-foreground h-[0.5px]" />
    </div>
  );
}
