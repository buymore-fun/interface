"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn, formatAddress } from "@/lib/utils";
import { ITokenItem } from "@/types/token";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CopyButton } from "@/components/ui/copy-button";
import toast from "react-hot-toast";
import { getSearchToken } from "@/hooks/services";
import { useRouter } from "next/navigation";
import { solChangeToToken } from "@/lib/constants";
interface TokenSearchProps {
  onSelect?: (token: ITokenItem) => void;
  className?: string;
}

export function TokenSearch({ onSelect, className }: TokenSearchProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<ITokenItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchOneToken = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setTokens([]);
      return;
    }

    setIsLoading(true);
    try {
      const tokens = await getSearchToken({ keyword: searchQuery });
      setTokens(tokens);
    } catch (error) {
      console.error("Error searching for token:", error);
      setTokens([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search to prevent too many requests
    const debounceTimer = setTimeout(() => {
      if (query.trim()) {
        searchOneToken(query);
      } else {
        setTokens([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setQuery("");
    setTokens([]);
    setIsOpen(false);
  };

  const handleSelect = (token: ITokenItem) => {
    if (onSelect) onSelect(token);

    router.push(`/swap?inputMint=${solChangeToToken("sol")}&outputMint=${token.address}`);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Command className="rounded-lg border overflow-visible bg-transparent">
        <div className="flex items-center justify-between border bg-secondary/30 rounded-lg border-primary focus-within:border-primary text-muted-foreground focus-within:text-foreground p-2 w-full">
          <CommandInput
            placeholder="Search token/contract"
            className="border-none outline-none bg-transparent p-0 ml-2 flex-1 text-sm h-7 w-full no-underline"
            value={query}
            onValueChange={setQuery}
            onFocus={handleInputFocus}
          />
          {isOpen && query && (
            <button
              onClick={handleClose}
              className="shrink-0 p-1 hover:bg-secondary/50 rounded-full"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {isOpen && (
          <div className="absolute w-full z-50 mt-12 rounded-lg border border-primary bg-background shadow-md overflow-hidden">
            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandEmpty>
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {isLoading
                    ? "Loading..."
                    : query.trim()
                      ? "No token found for this address."
                      : "Enter a token address to search."}
                </div>
              </CommandEmpty>

              {tokens.length > 0 && (
                <CommandGroup
                  heading="Token"
                  className="px-2 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tokens.map((token) => (
                    <CommandItem
                      key={token.address}
                      value={token.address}
                      onSelect={() => handleSelect(token)}
                      className="flex items-center py-2 px-3 hover:bg-secondary/30 cursor-pointer border-b border-primary/10 last:border-0"
                    >
                      <div className="flex flex-col w-full gap-1">
                        <div className="font-medium text-base text-white">{token.symbol}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <div className="truncate">{formatAddress(token.address)}</div>
                          <CopyButton
                            text={token.address}
                            onCopy={(event) => {
                              event?.preventDefault();
                              event?.stopPropagation();
                              toast.success("Copied to clipboard");
                            }}
                          />
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  );
}
