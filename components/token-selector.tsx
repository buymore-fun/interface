"use client";

import { useState } from "react";
import { Search, ChevronDown, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ellipseMiddle } from "@/lib/utils/common";
import { getExplorerUrlFromToken } from "@/config";
import { CopyButton } from "@/components/copy-button";

// Token type definition
type Token = {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  address: string;
};

// Sample token data
const tokens: Token[] = [
  {
    id: "sol",
    symbol: "SOL",
    name: "SOL",
    icon: "https://swap.pump.fun/tokens/sol_square.svg",
    address: "So11111111111111111111111111111111111111112",
  },
  {
    id: "usde",
    symbol: "USDe",
    name: "USDe",
    icon: "https://swap.pump.fun/tokens/usde.webp",
    address: "DEkqHyPN7GMRJ5cArtQFAWefqbZb33Hyf6s5iCwjEonT",
  },
  {
    id: "trx",
    symbol: "TRX",
    name: "Tron",
    icon: "https://swap.pump.fun/tokens/trx.webp",
    address: "GbbesPbaYh5uiAZSYNXTc7w9jty1rpg3P9L4JeN4LkKc",
  },
  {
    id: "apt",
    symbol: "APT",
    name: "Aptos",
    icon: "https://swap.pump.fun/tokens/aptos.webp",
    address: "DTDQEQWgBmnnJ7YGVoQrXkkroTEUkYgAfhEVb8CrnkpC",
  },
  {
    id: "pengu",
    symbol: "PENGU",
    name: "Pudgy Penguins",
    icon: "https://swap.pump.fun/tokens/pengu.webp",
    address: "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv",
  },
];

interface TokenSelectorProps {
  defaultToken?: Token | null;
  onSelectToken?: (token: Token) => void;
  buttonVariant?: "default" | "token";
  buttonText?: string;
}

export function TokenSelector({
  defaultToken = null,
  onSelectToken,
  buttonVariant = "default",
  buttonText = "Select token",
}: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(defaultToken);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectToken = (token: Token) => {
    setSelectedToken(token);
    if (onSelectToken) {
      onSelectToken(token);
    }
    setOpen(false);
  };

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className={`flex items-center gap-2  px-4 py-2 rounded-lg bg-gray-800 border-gray-700 text-white hover:bg-gray-700 ${
          buttonVariant === "token" ? "min-w-[120px]" : "min-w-[80px]"
        }`}
      >
        {selectedToken && buttonVariant === "token" ? (
          <>
            <div className="flex items-center gap-2">
              <img
                src={selectedToken.icon || "/placeholder.svg"}
                alt={selectedToken.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium">{selectedToken.symbol}</span>
            </div>
            <ChevronDown className="ml-auto h-5 w-5" />
          </>
        ) : (
          <>
            {buttonVariant === "token" && (
              <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-xs">?</span>
              </div>
            )}
            <span>{buttonText}</span>
            <ChevronDown className="ml-auto h-5 w-5" />
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-gray-900 text-white border-gray-800">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-normal">select a token</DialogTitle>
            {/* <DialogClose className="text-gray-400 hover:text-white">[close]</DialogClose> */}
          </DialogHeader>

          <div className="flex items-center gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                placeholder="Search by name, symbol or address"
                className="pl-10 bg-gray-800 border-gray-700 text-white h-12 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-green-200 hover:bg-green-300 text-green-900 rounded-lg h-12 px-6">
              search
            </Button>
          </div>

          <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
            {filteredTokens.map((token) => (
              <div
                key={token.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSelectToken(token)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={token.icon || "/placeholder.svg"}
                    alt={token.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{token.symbol}</span>
                      <span className="text-gray-400">{token.name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <a
                    href={getExplorerUrlFromToken(token.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-400"
                  >
                    [explorer]
                  </a>

                  <div className="flex items-center gap-1">
                    <CopyButton text={token.address} />
                    <span className="text-gray-400 text-sm">{ellipseMiddle(token.address)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
