import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (Array.isArray(error)) return error.map(getErrorMessage).join(", ");
  if (error && typeof error === "object" && "message" in error)
    return String((error as { message: string }).message);
  return "Invalid value";
}
