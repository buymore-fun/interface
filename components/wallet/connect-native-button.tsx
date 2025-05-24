"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import Image from "next/image";
import { Wallet } from "lucide-react";
import { useEffect } from "react";
import { formatAddress } from "@/lib/utils/format-address";
import { usePersonalBuyMore } from "@/hooks/use-personal-buymore";
import { useWallet } from "@solana/wallet-adapter-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useConnectWalletModalOpen } from "@/hooks/use-connect-wallet-modal";

export default function ConnectNativeButton() {
  const { pathname } = useRouter();
  const { publicKey, disconnect, wallet } = useWallet();
  const { personalBuyMore, isPersonalBuyMoreLoading, fetchPersonalBuyMore } = usePersonalBuyMore(
    publicKey?.toString() as string
  );
  const [, setOpen] = useConnectWalletModalOpen();

  const isHomePage = pathname === "/";

  useEffect(() => {
    if (publicKey) {
      fetchPersonalBuyMore();
    }
  }, [publicKey]);

  return (
    <>
      {!isHomePage && (
        <>
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
                  {isPersonalBuyMoreLoading ? (
                    <Skeleton className="w-16 h-4" />
                  ) : (
                    <span className="text-white">$ {personalBuyMore}</span>
                  )}
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
    </>
  );
}
