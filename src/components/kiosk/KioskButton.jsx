import React from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-kiosk-accent hover:bg-kiosk-accentHover text-white shadow-lg shadow-kiosk-accent/20",
  success: "bg-kiosk-success hover:bg-kiosk-successDark text-white shadow-lg shadow-kiosk-success/20",
  light: "bg-white hover:bg-slate-100 text-kiosk-bg shadow-lg",
  ghost: "bg-transparent border-2 border-kiosk-border hover:bg-kiosk-surface text-white",
  warning: "bg-kiosk-warning hover:bg-amber-600 text-kiosk-bg shadow-lg",
  danger: "bg-kiosk-danger hover:bg-red-600 text-white shadow-lg",
  dark: "bg-kiosk-surface hover:bg-kiosk-panel text-white border border-kiosk-border",
};

const sizes = {
  md: "px-8 py-4 text-xl gap-2",
  lg: "px-12 py-6 text-2xl gap-3",
  xl: "px-16 py-8 text-3xl gap-4",
};

const iconSizes = { md: "w-5 h-5", lg: "w-7 h-7", xl: "w-9 h-9" };

export default function KioskButton({
  children,
  onClick,
  variant = "primary",
  size = "lg",
  className,
  disabled,
  icon: Icon,
  iconRight = false,
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-xl font-bold tracking-wide transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed inline-flex items-center justify-center select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && !iconRight && <Icon className={iconSizes[size]} strokeWidth={2.5} />}
      {children}
      {Icon && iconRight && <Icon className={iconSizes[size]} strokeWidth={2.5} />}
    </button>
  );
}