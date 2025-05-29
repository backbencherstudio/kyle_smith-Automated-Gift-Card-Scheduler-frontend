import { AppConfig } from "@/config/app.config";
import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
 
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal'],
  variable: '--font-nunito', // Custom variable name
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal'],
  variable: '--font-inter', // Custom variable name
});
export const metadata: Metadata = {
  title: AppConfig().app.name,
  description: AppConfig().app.slogan,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` ${inter.variable} ${nunito.variable} `}>
        {children}</body>
    </html>
  );
}
