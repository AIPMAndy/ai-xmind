import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI XMind - 智能思维导图工具",
  description: "结合先进AI技术，快速创建、扩展和优化思维导图",
  keywords: ["思维导图", "AI", "XMind", "GPT", "Claude", "智能工具"],
  authors: [{ name: "AI XMind Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
