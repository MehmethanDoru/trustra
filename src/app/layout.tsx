import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trustra - Hava Durumuna Göre Seyahat",
  description: "Hava durumuna göre Türkiye'deki şehirleri keşfedin. İstediğiniz hava koşullarına sahip şehirleri bulun ve seyahat planınızı yapın.",
  keywords: "hava durumu, seyahat, Türkiye şehirleri, tatil planlama, gezi rehberi, hava tahminleri",
  authors: [{ name: 'Mehmethan Doru' }],
  creator: 'Trustra',
  publisher: 'Trustra',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'trustra-git-master-mdoru22-gmailcoms-projects.vercel.app',
    siteName: 'Trustra',
    title: 'Trustra - Hava Durumuna Göre Seyahat',
    description: "Hava durumuna göre Türkiye'deki şehirleri keşfedin. İstediğiniz hava koşullarına sahip şehirleri bulun ve seyahat planınızı yapın.",
    images: [
      {
        url: 'vercel.svg',
        width: 1200,
        height: 630,
        alt: 'Trustra - Hava Durumuna Göre Seyahat',
      }
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  alternates: {
    canonical: 'trustra-git-master-mdoru22-gmailcoms-projects.vercel.app',
  },
  category: 'travel',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
      
        
      </body>
    </html>
  );
}
