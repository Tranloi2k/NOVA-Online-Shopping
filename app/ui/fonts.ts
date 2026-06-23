import { Inter, Outfit, Lusitana, Sora, Manrope } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-outfit",
  display: "swap",
});

export const lusitana = Lusitana({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});
