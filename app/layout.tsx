import type { Metadata } from "next";
import { Suspense } from "react";
import { Space_Grotesk } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { ToastHost } from "@/components/Toast";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Soft Fresh Flower ISB",
  description: "Fresh flowers delivered across Islamabad.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Suspense fallback={null}>
          <SiteHeader />
        </Suspense>
        {children}
        <Suspense fallback={null}>
          <SiteFooter />
        </Suspense>
        <ToastHost />
      </body>
    </html>
  );
}
