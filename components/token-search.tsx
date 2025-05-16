"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
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

// Mock data for demonstration
const mockTokens: ITokenItem[] = [
  {
    address: "So11111111111111111111111111111111111111112",
    name: "SOL",
    symbol: "SOL",
    decimals: 9,
    logoURI: "https://swap.pump.fun/tokens/sol_square.svg",
    tags: ["native"],
    daily_volume: 1500000,
    created_at: "2023-01-01",
    freeze_authority: null,
    mint_authority: null,
    permanent_delegate: null,
    minted_at: "2023-01-01",
    extensions: {},
  },
  {
    address: "DEkqHyPN7GMRJ5cArtQFAWefqbZb33Hyf6s5iCwjEonT",
    name: "USDe",
    symbol: "USDe",
    decimals: 9,
    logoURI: "https://swap.pump.fun/tokens/usde.webp",
    tags: ["stablecoin"],
    daily_volume: 500000,
    created_at: "2023-02-01",
    freeze_authority: null,
    mint_authority: null,
    permanent_delegate: null,
    minted_at: "2023-02-01",
    extensions: {},
  },
  {
    address: "GbbesPbaYh5uiAZSYNXTc7w9jty1rpg3P9L4JeN4LkKc",
    name: "Tron",
    symbol: "TRX",
    decimals: 9,
    logoURI: "https://swap.pump.fun/tokens/trx.webp",
    tags: ["wrapped"],
    daily_volume: 200000,
    created_at: "2023-03-01",
    freeze_authority: null,
    mint_authority: null,
    permanent_delegate: null,
    minted_at: "2023-03-01",
    extensions: {},
  },
  {
    address: "DTDQEQWgBmnnJ7YGVoQrXkkroTEUkYgAfhEVb8CrnkpC",
    name: "Aptos",
    symbol: "APT",
    decimals: 9,
    logoURI: "https://swap.pump.fun/tokens/aptos.webp",
    tags: ["wrapped"],
    daily_volume: 100000,
    created_at: "2023-04-01",
    freeze_authority: null,
    mint_authority: null,
    permanent_delegate: null,
    minted_at: "2023-04-01",
    extensions: {},
  },
  {
    address: "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv",
    name: "Pudgy Penguins",
    symbol: "PENGU",
    decimals: 9,
    logoURI: "https://swap.pump.fun/tokens/pengu.webp",
    tags: ["meme"],
    daily_volume: 75000,
    created_at: "2023-05-01",
    freeze_authority: null,
    mint_authority: null,
    permanent_delegate: null,
    minted_at: "2023-05-01",
    extensions: {},
  },
];

interface TokenSearchProps {
  onSelect?: (token: ITokenItem) => void;
  className?: string;
}

export function TokenSearch({ onSelect, className }: TokenSearchProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<ITokenItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // In a real implementation, this would fetch tokens from an API
  const fetchTokens = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // If query is empty, return all tokens
      if (!searchQuery.trim()) {
        return mockTokens;
      }

      // Mock filtering for demonstration
      return mockTokens.filter(
        (token) =>
          token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } finally {
      setIsLoading(false);
    }
  };

  const searchOneToken = async (searchQuery: string) => {
    // DhF9GCD9kbeEjUu3GYVH23g71YdAB46tMNBAPnJmizsM
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
    const getTokens = async () => {
      const filteredTokens = await fetchTokens(query);
      setTokens(filteredTokens);
    };

    getTokens();
  }, [query]);

  // Initialize tokens on client-side only
  useEffect(() => {
    setTokens(mockTokens);
  }, []);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setQuery("");
    setIsOpen(false);
  };

  const handleSelect = (token: ITokenItem) => {
    if (onSelect) onSelect(token);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Command className="rounded-lg border overflow-visible bg-transparent">
        <div className="flex items-center justify-between border bg-secondary/30 rounded-lg border-primary focus-within:border-primary text-muted-foreground focus-within:text-foreground p-2 w-full">
          <CommandInput
            placeholder="Search token/contract"
            className="border-none outline-none bg-transparent p-0 ml-2 flex-1 text-sm h-7"
            value={query}
            onValueChange={setQuery}
            onFocus={handleInputFocus}
          />
          {isOpen && (
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
                  {isLoading ? "Loading..." : "No tokens found."}
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
                          <p className="truncate">{formatAddress(token.address)}</p>
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
