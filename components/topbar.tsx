"use client";

import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Wallet } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane, FaRegFileWord } from "react-icons/fa";
import { useConnectWalletModalOpen } from "@/hooks/use-connect-wallet-modal";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { TokenSearch } from "./token-search";
import ConnectPrivyButton from "@/components/wallet/connect-privy-button";

export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [, setOpen] = useConnectWalletModalOpen();

  return (
    <div className="p-4 border-b sticky top-0 left-0 w-full z-50 bg-background/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto ">
        <div className="flex justify-between items-center w-full gap-6">
          <div className="flex justify-between items-center flex-1">
            <div className="flex-1 -my-4 cursor-pointer relative" onClick={() => router.push("/")}>
              {/* <Image
                src={"/logo.png"}
                alt="Logo"
                width={80}
                height={80}
                className={cn("size-20", "object-cover")}
              /> */}
              <div className="relative w-[120px] h-[80px] ">
                <video
                  src="/logo.mp4"
                  autoPlay
                  muted
                  // loop
                  playsInline
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>

              <div className="absolute top-6 left-[112px] text-primary text-sm animate-fade-in">
                Alpha
              </div>
            </div>

            <div className="flex-grow hidden sm:block">
              <TokenSearch />
            </div>
          </div>
          <div className="flex-1 flex justify-end space-x-4 sm:max-w-[420px]">
            <div className="flex gap-2">
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

            {/* Using our Privy ConnectButton component */}
            <ConnectPrivyButton />
          </div>
        </div>
      </div>
    </div>
  );
}
