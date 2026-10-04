import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const vietnamPro = Be_Vietnam_Pro({
  variable: "--font-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Việc học của tôi",
  description: "Không gian học tập cá nhân.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${vietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
