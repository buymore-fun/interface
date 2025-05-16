"use client";

import { Check, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useClipboard } from "@/hooks/use-clipboard";
import { useBoolean } from "@/hooks/use-boolean";
import { useCommonToast } from "@/hooks/use-common-toast";

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
  const { successToast } = useCommonToast();

  // Handle copying
  const handleCopy = () => {
    if (!text) return;

    // Copy text to clipboard
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Show success state
        copyState.on();

        // Show toast if enabled
        if (showToast) {
          successToast(successMessage);
        }

        // Reset after duration
        setTimeout(() => {
          copyState.off();
        }, duration);
      })
      .catch((error) => {
        console.error("Failed to copy text:", error);
      });
  };

  // Button component styling
  const buttonClasses = cn(
    "inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    className
  );

  if (copyState.value) {
    return (
      <button className={buttonClasses} disabled {...props}>
        <Check size={iconSize} className="text-primary" />
      </button>
    );
  }

  return (
    <button className={buttonClasses} onClick={handleCopy} title="Copy to clipboard" {...props}>
      <Copy size={iconSize} className="text-muted-foreground" />
    </button>
  );
}
