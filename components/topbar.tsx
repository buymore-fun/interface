"use client";

import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Wallet } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane, FaRegFileWord } from "react-icons/fa";
import { useConnectWalletModalOpen } from "@/hooks/use-connect-wallet-modal";
import { useWallet } from "@solana/wallet-adapter-react";
import { cn, ellipseMiddle } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export function Topbar() {
  const router = useRouter();
  const [, setOpen] = useConnectWalletModalOpen();
  const { publicKey, disconnect, wallet } = useWallet();
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const animationDuration = 1400;

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, animationDuration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 border-b sticky top-0 left-0 w-full z-50 bg-background/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto ">
        <div className="flex justify-between items-center w-full gap-6">
          <div className="flex justify-between items-center flex-1">
            <div className="flex-1 -my-4 cursor-pointer" onClick={() => router.push("/")}>
              {/* <Image
                src={isAnimating ? "/logo.gif" : "/logo_v3.png"}
                alt="Logo"
                width={80}
                height={80}
                className={cn("size-20", "object-cover")}
                unoptimized
                priority
                loading="eager"
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
            </div>

            <div className="flex-grow  hidden sm:block ">
              <div className="flex border bg-secondary/30  rounded-lg  border-primary focus-within:border-primary text-muted-foreground focus-within:text-foreground items-center p-2">
                <Search className="size-3 text-primary" />
                <Input
                  placeholder="Search token/contract"
                  className="border-none outline-none p-0 ml-2 flex-1 text-sm"
                />
              </div>
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
            {publicKey ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={disconnect}
                    className="px-3 rounded-md border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    {wallet ? (
                      <Image
                        src={wallet.adapter.icon}
                        alt={wallet.adapter.name}
                        width={64}
                        height={64}
                        className="size-6 rounded-full"
                      />
                    ) : null}
                    {ellipseMiddle(publicKey.toString())}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {/* <DropdownMenuItem> */}
                  <div className="flex flex-col gap-1 text-sm px-3 pt-2">
                    <span className="text-muted-foreground">Total Buymore </span>
                    <span className="text-white">$888.999</span>
                  </div>
                  {/* </DropdownMenuItem> */}
                  <DropdownMenuItem>
                    <Button
                      variant="ghost"
                      onClick={disconnect}
                      className="w-full text-white flex justify-between px-1"
                    >
                      <Wallet className="text-muted-foreground size-3" />
                      Disconnect
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => setOpen(true)}
              >
                Connect
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
