import Link from "next/link";
import type { ComponentProps } from "react";

export function CardLink({
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 transition-[background-color,border-color,transform] duration-150 ease-out hover:border-neutral-700 hover:bg-neutral-800 active:scale-[0.98] ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
