import { Token } from "@/types/token";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function TokenIcon({
  token,
  size = "md",
}: {
  token: Token;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div
      className={cn(
        "rounded-full bg-secondary flex items-center justify-center",
        size === "sm" ? "size-6" : size === "md" ? "size-8" : "size-10"
      )}
    >
      {token.icon ? (
        <Image
          src={`https://wsrv.nl/?w=64&h=64&url=${token.icon}`}
          className={cn("rounded-full w-full h-full")}
          width={128}
          alt={token.symbol}
          height={128}
        />
      ) : (
        <span>{token.symbol.slice(2)}</span>
      )}
    </div>
  );
}
