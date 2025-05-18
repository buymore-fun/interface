import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { Edit, Globe, Wallet, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { RiMoneyDollarCircleLine, RiUserLocationLine } from "react-icons/ri";
import { Separator } from "./ui/separator";

import HolderIcon from "@/public/assets/token/holders.svg";
import ActiveFundIcon from "@/public/assets/token/active-fund.svg";
import CommunityMembersIcon from "@/public/assets/token/community-members.svg";
import ActiveMembersIcon from "@/public/assets/token/active-members.svg";
import { useParams } from "next/navigation";
import { useCommunityDetail } from "@/hooks/services";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { formatPrice, formatTime, formatTimeToFull } from "@/lib/utils";
import { div } from "@raydium-io/raydium-sdk-v2";
import { Button } from "@/components/ui/button";

export function Community() {
  const { address } = useParams();
  const { data, isLoading } = useCommunityDetail({ inputMint: address as string });

  return (
    <>
      <div className="flex justify-between">
        <span className="font-semibold text-lg">Community</span>
      </div>
      <div className="border border-muted-foreground/15 rounded-lg  gap-5 flex flex-col pb-4">
        <div className="px-4 flex py-3 border rounded-t-lg bg-muted-foreground/15 space-x-4 justify-between">
          {isLoading ? (
            <Skeleton className="w-10 h-4" />
          ) : (
            <div className="space-x-6 flex">
              {data?.contact?.x?.enable && (
                <Link href={data?.contact?.x?.url} target="_blank" className="hover:text-primary">
                  <FaXTwitter className="size-4" />
                </Link>
              )}
              {data?.contact?.tg?.enable && (
                <Link href={data?.contact?.tg?.url} target="_blank" className="hover:text-primary">
                  <FaTelegramPlane className="size-4" />
                </Link>
              )}
              {data?.contact?.web?.enable && (
                <Link href={data?.contact?.web?.url} target="_blank" className="hover:text-primary">
                  <Globe className="size-4" />
                </Link>
              )}
              {data?.contact?.dex?.enable && (
                <Link href={data?.contact?.dex?.url} target="_blank" className="hover:text-primary">
                  {/* ToDo svg */}
                  <Image
                    src="/dexscreener.png"
                    width={64}
                    height={64}
                    alt="DexScreener"
                    className="size-4"
                  />
                </Link>
              )}
            </div>
          )}
          <Link
            href="#"
            className="text-primary inline-flex items-center text-sm space-x-1 hover:text-foreground hover:underline"
          >
            {/* <Edit className="size-4" /> */}
            <span>Update</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 px-3">
          <div
            onClick={() => {
              window.open(data?.contact?.tg?.url, "_blank");
            }}
            className="flex bg-muted-foreground/15 rounded-lg px-6 py-2 items-center border-[0.5px] justify-between text-primary border-primary cursor-pointer"
          >
            <Image src={ActiveFundIcon} alt={"active fund"} />
            <div className="flex flex-col ml-3  items-end">
              <span className="text-xs ">Active fund</span>
              {isLoading ? (
                <Skeleton className="w-10 h-4" />
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-sm text-white">{formatPrice(data?.active_fund.value)}</span>
                  <Image src={"/assets/token/next.svg"} width={12} height={12} alt={"next"} />
                </div>
              )}
            </div>
          </div>
          <div className="flex bg-muted-foreground/15 rounded-lg px-6 py-2 items-center border border-transparent justify-between   text-muted-foreground ">
            <Image src={HolderIcon} alt={"holders"} />
            <div className="flex flex-col ml-3 items-end">
              <span className="text-xs ">Holders</span>
              {isLoading ? (
                <Skeleton className="w-10 h-4" />
              ) : (
                <span className="text-sm text-white">{formatPrice(data?.holders.value)}</span>
              )}
            </div>
          </div>
          <div className="flex bg-muted-foreground/15 rounded-lg px-6 py-2 items-center border-[0.5px] border-transparent justify-between text-muted-foreground ">
            <Image src={CommunityMembersIcon} alt={"community members"} />
            <div className="flex flex-col ml-3  items-end">
              <span className="text-xs ">Community Mbrs</span>
              {isLoading ? (
                <Skeleton className="w-10 h-4" />
              ) : (
                <span className="text-sm text-white">
                  {formatPrice(data?.community_mbrs.value)}
                </span>
              )}
            </div>
          </div>
          <div className="flex bg-muted-foreground/15 rounded-lg px-6 py-2 items-center border-[0.5px] border-transparent justify-between  text-muted-foreground">
            <Image src={ActiveMembersIcon} alt={"active members"} />
            <div className="flex flex-col ml-3 items-end">
              <span className="text-xs text-muted-foreground hover:text-primary">Active Mbrs</span>
              {isLoading ? (
                <Skeleton className="w-10 h-4" />
              ) : (
                <span className="text-sm text-white">
                  {formatPrice(data?.active_mbrs_24h.value)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="px-4 pt-3 rounded-lg bg-muted-foreground/15 mx-3">
          <div className="font-semibold">Announcements</div>
          <div className="flex flex-col mt-2 gap-2">
            {data?.announcement?.items?.map((announcement, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Separator className="my-1 bg-muted-foreground h-[0.5px]" />}
                <div className="flex flex-col space-y-1">
                  <span className="text-muted-foreground text-xs">
                    {formatTimeToFull(announcement.time)}
                  </span>
                  <p className="text-sm text-muted-foreground">{announcement.content}</p>
                </div>
              </React.Fragment>
            )) || (
              <div className="flex flex-col space-y-1">
                <span className="text-muted-foreground text-xs">No announcements</span>
              </div>
            )}
            {data?.announcement?.items?.length !== 0 && (
              <div className="flex flex-col items-center py-2">
                <Separator className="my-1 bg-muted-foreground h-[0.5px]" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center justify-center gap-1"
                  onClick={() => {
                    window.open(data?.contact?.tg?.url, "_blank");
                  }}
                >
                  <span className="text-primary text-xs">Detail</span>
                  <Image
                    src={"/assets/token/next-outline.svg"}
                    width={12}
                    height={12}
                    alt={"next"}
                  />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
