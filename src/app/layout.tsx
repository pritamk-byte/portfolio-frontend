import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import HUD from "@/components/HUD";
// CanvasEngine import completely removed

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pritam | Software Engineer",
  description: "Interactive System Architecture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Changed bg-transparent to pure pitch black for the terminal aesthetic */}
      <body className={`${font.className} bg-[#000000] text-[#f4f4f4]`}>
        <CustomCursor />
        <Header />
        
        {/* CanvasEngine completely removed from here */}
        
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}