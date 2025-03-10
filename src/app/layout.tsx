import type { Metadata } from "next"
import { Roboto } from "next/font/google"

import "./globals.css"

import Link from "next/link"

const myRoboto = Roboto({
  variable: "--font-roboto",
  style: "normal",
  subsets: ["cyrillic", "latin"]
});

export const metadata: Metadata = {
  title: "Test SOME PHARMACY",
  description: "SOME PHARMACY",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${myRoboto.variable} antialiased`}
      >
        <nav className="h-[50px] p-[20px]">
          <Link href="/">Антибактериальные средства</Link>
          <span className="m-[0_10px]">/</span>
          <Link href="/about">Контакты</Link>
        </nav>
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}
