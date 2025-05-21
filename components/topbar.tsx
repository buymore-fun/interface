"use client";

import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Wallet } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane, FaRegFileWord } from "react-icons/fa";
import { useConnectWalletModalOpen } from "@/hooks/use-connect-wallet-modal";
import { useWallet } from "@solana/wallet-adapter-react";
import { cn, formatAddress } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import { TokenSearch } from "./token-search";
import config from "@/config";
import { useEffect, useState } from "react";
import { getPersonalBuyMore } from "@/hooks/services";
export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [, setOpen] = useConnectWalletModalOpen();
  const { publicKey, disconnect, wallet } = useWallet();
  const [personalBuyMore, setPersonalBuyMore] = useState<string>("0");
  const getPersonalBuyMoreData = async () => {
    const personalBuyMore = await getPersonalBuyMore({ wallet: publicKey?.toString() as string });
    setPersonalBuyMore(personalBuyMore.total_buymore_amount);
    console.log("🚀 ~ getPersonalBuyMore ~ personalBuyMore:", personalBuyMore);
  };
  const isHomePage = pathname === "/";

  useEffect(() => {
    if (publicKey) {
      getPersonalBuyMoreData();
    }
  }, [publicKey]);

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
            {!isHomePage && (
              <>
                {" "}
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
                            className="size-6 rounded-full hidden md:block"
                          />
                        ) : null}
                        {formatAddress(publicKey?.toString())}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {/* <DropdownMenuItem> */}
                      <div className="flex flex-col gap-1 text-sm px-3 pt-2">
                        <span className="text-muted-foreground">Total Buymore </span>
                        <span className="text-white">$ {personalBuyMore}</span>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
