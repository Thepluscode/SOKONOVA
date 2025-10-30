
import type { Metadata } from "next";
import "./globals.css";
import { Inter, Outfit } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { CartProvider } from "@/lib/cart";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "SokoNova — Africa’s new market constellation",
  description: "Modern African marketplace with secure payments and transparent shipping.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-[var(--font-inter)]">
        <Providers>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
