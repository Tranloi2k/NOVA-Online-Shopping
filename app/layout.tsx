import "@/app/ui/global.css";
import { inter, outfit, sora, manrope } from "@/app/ui/fonts";
import type { Metadata, Viewport } from "next";
import Providers from "@/app/providers";
import { rootMetadata } from "@/app/lib/seo";
import AIChatbot from "@/components/AIChatbot";

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} ${sora.variable} ${manrope.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
          <AIChatbot />
        </Providers>
      </body>
    </html>
  );
}
