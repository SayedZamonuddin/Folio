import type { Metadata } from "next";
import { Roboto, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "Folio — Your career, one link.",
    template: "%s | Folio",
  },
  description: "Build a beautiful portfolio in minutes. Share it with anyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          roboto.variable,
          playfair.variable,
          jetbrainsMono.variable,
          "font-sans antialiased"
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
