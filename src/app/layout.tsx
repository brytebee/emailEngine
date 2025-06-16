// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Email Service",
  description: "Easy private mails",
  authors: [
    {
      name: "Bright Atsighi",
      url: "https://linkedin.com/in/brytebee",
    },
  ],
  keywords: [
    "Private emails",
    "Quick emails",
    "Secure emails",
    "Communication",
  ],
  openGraph: {
    title: "Email Service",
    description: "Easy private mails",
    tags: ["Private emails", "Quick emails", "Secure emails", "Communication"],
    authors: "Bright Atsighi",
    images: [
      "https://res.cloudinary.com/dprkvmhld/image/upload/v1750093427/logoeee_msdhqz.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
