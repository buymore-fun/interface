"use client";

import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane, FaRegFileWord } from "react-icons/fa";
import { useConnectWalletModalOpen } from "@/hooks/use-connect-wallet-modal";
import { useWallet } from "@solana/wallet-adapter-react";
import { ellipseMiddle } from "@/lib/utils";

export function Topbar() {
  const [, setOpen] = useConnectWalletModalOpen();
  const { publicKey, disconnect } = useWallet();
  return (
    <div className="p-4 border-b sticky top-0 left-0 w-full z-50 bg-background/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-cetner">
          <div className="flex-1">
            <Image
              src="/logo.png"
              alt="Logo"
              className="w-14"
              width={1896}
              height={1132}
            />
          </div>
          <div className="flex-none w-1/3 hidden sm:block">
            <div className="flex border bg-secondary/30 border-input rounded-lg focus-within:border-primary text-muted-foreground focus-within:text-foreground items-center px-2">
              <Search className="size-4" />
              <Input
                placeholder="Search token/contract"
                className="border-none outline-none p-0 ml-2 flex-1"
              />
            </div>
          </div>
          <div className="flex-1 flex justify-end space-x-4">
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="rounded-full">
                <FaXTwitter className="size-5" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full">
                <FaTelegramPlane className="size-5" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full">
                <FaRegFileWord className="size-5" />
              </Button>
            </div>
            {publicKey ? (
              <Button variant="secondary" onClick={disconnect}>
                {ellipseMiddle(publicKey.toString())}
              </Button>
            ) : (
              <Button onClick={() => setOpen(true)}>Connect</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
