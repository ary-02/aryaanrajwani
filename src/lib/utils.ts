import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * The shadcn/ui `cn` helper. Imported blocks from shadcn-style registries
 * expect this at `@/lib/utils` — keep the path and signature as-is.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
