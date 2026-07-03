import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "bg-cardstock border border-black/5 rounded-[10px] shadow-[0_1px_2px_rgba(20,33,61,0.06)]",
        className
      )}
      {...props}
    />
  );
}
