import toast from "react-hot-toast";
import { getExplorerUrlFromTransaction } from "@/config";
export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={"text-center"}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink
          href={getExplorerUrlFromTransaction(signature)}
          label={"View Transaction"}
          className="btn btn-xs btn-primary"
        />
      </div>,
      {
        duration: 3000,
      }
    );
  };
}

function ExplorerLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className: string;
}) {
  return (
    <a href={href} target="_blank" className={className}>
      {label}
    </a>
  );
}
