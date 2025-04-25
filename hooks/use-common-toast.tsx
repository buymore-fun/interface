import toast from "react-hot-toast";
import { Icon } from "@/components/ui/icon";
import { ReactNode } from "react";

type ToastType = "success" | "error";

interface ToastOptions {
  duration?: number;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
}

export function useCommonToast() {
  const showToast = (
    title: string,
    content: ReactNode,
    type: ToastType = "success",
    options?: ToastOptions
  ) => {
    const colors = {
      success: "#03B177",
      error: "#D8697E",
    };

    const color = colors[type];

    toast(
      <div className="text-center px-4 py-2">
        <div className="text-lg flex gap-1 items-center">
          <span style={{ color }}>
            <Icon name={type} className="size-5" />
          </span>
          <span style={{ color }}>{title}</span>
        </div>
        {content && (
          <div className="flex gap-1 mt-1">
            <span className="text-white">{content}</span>
          </div>
        )}
      </div>,
      {
        duration: options?.duration || 3000,
        position: options?.position || "bottom-right",
        style: {
          borderRadius: "10px",
          background: "rgba(36, 39, 56, 1)",
        },
      }
    );
  };

  const successToast = (title: string, content?: ReactNode, options?: ToastOptions) => {
    showToast(title, content, "success", options);
  };

  const errorToast = (title: string, content?: ReactNode, options?: ToastOptions) => {
    showToast(title, content, "error", options);
  };

  return { showToast, successToast, errorToast };
}
