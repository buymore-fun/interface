import toast from "react-hot-toast";
import { getExplorerUrlFromTransaction } from "@/config";
import { Icon } from "@/components/ui/icon";
import { ExternalLink } from "lucide-react";
export function useTransactionToast() {
  return (signature: string) => {
    toast(
      <div className="text-center px-4 py-2">
        <div className="text-lg flex gap-1 items-center">
          <span style={{ color: "#03B177" }}>
            <Icon name="success" className="size-5" />
          </span>
          <span style={{ color: "#03B177" }}>Swap Confirmed</span>
        </div>
        <div className="flex gap-1 items-center">
          <span className="text-white">view transaction details.</span>

          <a
            href={getExplorerUrlFromTransaction(signature)}
            target="_blank"
            className="no-underline"
            style={{ color: "#03B177" }}
          >
            <ExternalLink className="size-4" />
          </a>
        </div>
      </div>,
      {
        duration: 3000,
        style: {
          borderRadius: "10px",
          background: "rgba(36, 39, 56, 1)",
        },
      }
    );
  };
}
