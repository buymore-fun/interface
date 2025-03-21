import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SlippageButton({
  slippage,
  onClick,
  selected,
}: {
  slippage: number;
  onClick: (percent: number) => void;
  selected: boolean;
}) {
  return (
    <Button
      size="xs"
      variant={selected ? "default" : "secondary"}
      className={cn("text-muted-foreground", selected && "text-white")}
      onClick={() => onClick(slippage)}
    >
      {slippage}%
    </Button>
  );
}

export function SlippageCustomButton({
  onClick,
  selected,
}: {
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <Button
      size="xs"
      variant={selected ? "default" : "secondary"}
      className={cn("text-muted-foreground", selected && "text-white")}
      onClick={() => onClick()}
    >
      Custom
    </Button>
  );
}
