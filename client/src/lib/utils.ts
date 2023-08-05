import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clearCookies() {
  // Split all cookies into an array
  const cookies = document.cookie.split(";");

  // Loop through each cookie and clear it by setting an expired date in the past
  cookies.forEach((cookie) => {
    const [name] = cookie.split("="); // Extract cookie name
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
}
