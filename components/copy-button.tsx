"use client";

import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

import { useBoolean } from "@/hooks/use-boolean";
import { useCommonToast } from "@/hooks/use-common-toast";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The text to copy to clipboard
   */
  text: string;
  /**
   * Show success toast after copying (optional)
   * @default true
   */
  showToast?: boolean;
  /**
   * Success message after copying (optional)
   * @default "Copied to clipboard"
   */
  successMessage?: string;
  /**
   * Size of the icon (optional)
   * @default 20
   */
  iconSize?: number;
  /**
   * How long to show the success state in milliseconds (optional)
   * @default 3000
   */
  duration?: number;
}

export function CopyButton({
  text,
  showToast = true,
  successMessage = "Copied to clipboard",
  iconSize = 20,
  duration = 3000,
  className,
  ...props
}: CopyButtonProps) {
  // Use our existing hooks
  const copyState = useBoolean(false);
  const { copy } = useCopyToClipboard();
  const { successToast } = useCommonToast();

  // Handle copying
  const handleCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!text) return;

    event.stopPropagation();
    event.preventDefault();

    copy(text)
      .then(() => {
        copyState.setTrue();

        if (showToast) {
          successToast(successMessage);
        }

        setTimeout(() => {
          copyState.setFalse();
        }, duration);
      })
      .catch((error) => {
        console.error("Failed to copy text:", error);
      });
  };

  // Button component styling
  const buttonClasses = cn(
    "inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-full",
    className
  );

  if (copyState.value) {
    return (
      <button className={buttonClasses} disabled {...props}>
        <Check size={iconSize} className="text-green-500" />
      </button>
    );
  }

  return (
    <button className={buttonClasses} onClick={handleCopy} title="Copy to clipboard" {...props}>
      <Copy size={iconSize} className="text-foreground" />
    </button>
  );
}
