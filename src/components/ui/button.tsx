import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center gap-2 px-4 py-2 rounded-[8px] text-sm font-medium transition-colors",
        variant === "primary" &&
          "bg-ink text-paper hover:bg-ink-light",
        variant === "secondary" &&
          "bg-transparent border border-ink/15 text-ink hover:bg-ink/5",
        variant === "ghost" &&
          "bg-transparent text-ink/70 hover:text-ink hover:bg-ink/5",
        className
      )}
      {...props}
    />
  );
}
