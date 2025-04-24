"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChartType, TableTime } from "@/types/chart";

interface TimeGroupProps {
  className?: string;
  typeObject: object;
  onTypeChange: (type: string) => void;
  selectedType: string;
}

export function TimeGroup({ className, typeObject, onTypeChange, selectedType }: TimeGroupProps) {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {Object.values(typeObject).map((currentType, index) => (
        <Button
          variant="secondary"
          size="xs"
          className={cn(
            "text-muted-foreground hover:text-white hover:bg-primary/80 min-w-10",
            selectedType === currentType && "text-white bg-primary",
            index === 0 && "rounded-l-full",
            index === Object.values(typeObject).length - 1 && "rounded-r-full",
            index !== 0 && index !== Object.values(typeObject).length - 1 && "rounded-none"
          )}
          onClick={() => onTypeChange(currentType)}
          key={currentType}
        >
          {currentType}
        </Button>
      ))}
    </div>
  );
}
