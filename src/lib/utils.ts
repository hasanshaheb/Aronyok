import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SupportedLanguage } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert English digits to Bengali numerals
export function toBengaliNumerals(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
}

// Format currency with symbol
export function formatCurrency(amount: number, lang: SupportedLanguage = 'en'): string {
  if (lang === 'bn') {
    return `৳${toBengaliNumerals(Math.round(amount).toLocaleString('en-IN'))}`;
  }
  return `৳${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

// Slugify text
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}
