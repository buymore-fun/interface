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

export function Community() {
  return (
    <>
      <div className="flex justify-between">
        <span className="font-semibold text-lg">Community</span>
      </div>
      <div className="px-4 flex py-3 border rounded-lg bg-secondary mt-2 space-x-4 justify-between">
        <div className="space-x-4 flex">
          <Link href="" target="_blank" className="hover:text-primary">
            <FaXTwitter className="size-4" />
          </Link>
          <Link href="" target="_blank" className="hover:text-primary">
            <FaTelegramPlane className="size-4" />
          </Link>
          <Link href="" target="_blank" className="hover:text-primary">
            <Globe className="size-4" />
          </Link>
          <Link href="" target="_blank" className="hover:text-primary">
            <Image
              src="/dexscreener.png"
              width={64}
              height={64}
              alt="DexScreener"
              className="size-4"
            />
          </Link>
        </div>
        <Link
          href="#"
          className="text-muted-foreground inline-flex items-center text-sm space-x-1 hover:text-foreground hover:underline"
        >
          <Edit className="size-4" />
          <span>Update</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="flex bg-secondary rounded-lg px-3 py-2 items-center">
          <Image src={ActiveFundIcon} alt={"active fund"} />
          <div className="flex flex-col ml-3">
            <span className="text-xs text-muted-foreground">Active fund</span>
            <span className="text-sm">$99,999</span>
          </div>
        </div>
        <div className="flex bg-secondary rounded-lg px-3 py-2 items-center">
          <Image src={HolderIcon} alt={"holders"} />
          <div className="flex flex-col ml-3">
            <span className="text-xs text-muted-foreground">Holders</span>
            <span className="text-sm">99,999</span>
          </div>
        </div>
        <div className="flex bg-secondary rounded-lg px-3 py-2 items-center">
          <Image src={CommunityMembersIcon} alt={"community members"} />
          <div className="flex flex-col ml-3">
            <span className="text-xs text-muted-foreground">Community Mbrs</span>
            <span className="text-sm">99,999</span>
          </div>
        </div>
        <div className="flex bg-secondary rounded-lg px-3 py-2 items-center">
          <Image src={ActiveMembersIcon} alt={"active members"} />
          <div className="flex flex-col ml-3">
            <span className="text-xs text-muted-foreground">Active Mbrs</span>
            <span className="text-sm">99,999</span>
          </div>
        </div>
      </div>
      <div className="px-3 py-2 rounded-lg bg-secondary/30">
        <div className="font-semibold">Announcements</div>
        <div className="flex flex-col mt-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground text-xs">13:12 01/31 2025</span>
            <p className="text-sm">
              This coin is never going to die and you all proved it. One goes two come💫 We going to
              see a lot of them again tho in a couple weeks fomoing 🤪 Love you TEAM❤️
            </p>
          </div>
          <Separator />
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground text-xs">13:12 01/31 2025</span>
            <p className="text-sm">
              This coin is never going to die and you all proved it. One goes two come💫 We going to
              see a lot of them again tho in a couple weeks fomoing 🤪 Love you TEAM❤️
            </p>
          </div>
          <Separator />
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground text-xs">13:12 01/31 2025</span>
            <p className="text-sm">
              This coin is never going to die and you all proved it. One goes two come💫 We going to
              see a lot of them again tho in a couple weeks fomoing 🤪 Love you TEAM❤️
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
