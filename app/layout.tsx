import { AppConfig } from "@/config/app.config";
import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import CustomToastContainer from "@/components/CustomToast/CustomToastContainer";
import { AuthProvider } from "@/contexts/AuthContext";
 
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal'],
  variable: '--font-nunito', 
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal'],
  variable: '--font-inter',
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
        <AuthProvider>
          {children}
          <CustomToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
