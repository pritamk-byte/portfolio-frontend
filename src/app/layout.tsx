import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import HUD from "@/components/HUD";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pritam | Software Engineer",
  description: "Interactive System Architecture",
  // 👇 Explicitly telling the browser where the icon is
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} bg-[#000000] text-[#f4f4f4]`}>
        <CustomCursor />
        <Header />
        
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}