import { clsx } from "clsx";

export function LogoMark({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4.5 8.2C4.5 6.4 6.2 5 8.2 5H15.2V25.4H8.2C6.2 25.4 4.5 24 4.5 22.2V8.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M27.5 8.2C27.5 6.4 25.8 5 23.8 5H16.8V25.4H23.8C25.8 25.4 27.5 24 27.5 22.2V8.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <line
        x1="16"
        y1="5"
        x2="16"
        y2="25.4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="18.3"
        y="10.6"
        width="8"
        height="4.2"
        rx="1"
        fill="var(--color-amber)"
        opacity="0.75"
        transform="rotate(-5 22.3 12.7)"
      />
    </svg>
  );
}

export function Logo({
  size = 28,
  className,
  wordmarkClassName,
}: {
  size?: number;
  className?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={clsx("inline-flex items-center gap-2", className)}>
      <LogoMark size={size} className="text-ink shrink-0" />
      <span
        className={clsx(
          "font-display text-ink leading-none",
          wordmarkClassName,
        )}
      >
        Thesis Buddy
      </span>
    </span>
  );
}
