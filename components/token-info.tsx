import { Button } from "./ui/button";
import { Clipboard } from "lucide-react";

export function TokenInfo() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="size-8 rounded-full bg-secondary" />
        <div className="flex flex-col">
          <div className="flex space-x-2 items-center">
            <span className="font-semibold">FOOD</span>
            <span className="text-xs text-[#dd5e56]">$0.0000312321</span>
          </div>
          <div className="space-x-1 flex items-center">
            <span className="text-xs text-muted-foreground">ovGPakk...GFM</span>
            <Button
              variant="ghost"
              className="w-5 h-5 p-0 text-muted-foreground hover:text-foreground"
            >
              <Clipboard className="size-3" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="outline" size="xs" className="text-muted-foreground">
          1m
        </Button>
        <Button variant="secondary" size="xs">
          5m
        </Button>
        <Button variant="outline" size="xs" className="text-muted-foreground">
          1h
        </Button>
        <Button variant="outline" size="xs" className="text-muted-foreground">
          4h
        </Button>
      </div>
    </div>
  );
}
