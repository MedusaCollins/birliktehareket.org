import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Birlikte Hareket | Sesimiz Değişim Getirsin",
  description:
    "Toplumsal farkındalık yaratmak için yürüyüşler düzenleyin ve toplulukları bir araya getirin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Navbar />
          <div className="pt-[66px]">{children}</div>
          <Footer />
          <Toaster />
        </body>
      </html>
    </AuthProvider>
  );
}
