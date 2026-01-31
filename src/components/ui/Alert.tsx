import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export interface AlertProps {
  variant?: "error" | "success" | "warning" | "info";
  children: ReactNode;
  className?: string;
}

const variantStyles = {
  error: "bg-red-50 text-red-600",
  success: "bg-green-50 text-green-800",
  warning: "bg-yellow-50 text-yellow-800",
  info: "bg-blue-50 text-blue-800",
};

export function Alert({ variant = "info", children, className }: AlertProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-3 text-sm",
        variantStyles[variant],
        className,
      )}
      role="alert"
    >
      {children}
    </div>
  );
}
