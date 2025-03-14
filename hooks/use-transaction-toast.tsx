import toast from "react-hot-toast";

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={"text-center"}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink
          path={`tx/${signature}`}
          label={"View Transaction"}
          className="btn btn-xs btn-primary"
        />
      </div>
    );
  };
}

function ExplorerLink({
  path,
  label,
  className,
}: {
  path: string;
  label: string;
  className: string;
}) {
  return (
    <a href={`https://explorer.solana.com/${path}`} className={className}>
      {label}
    </a>
  );
}
