import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Perdue Construction | Custom Trim & Finish Carpentry",
  description:
    "Family-owned trim & finish carpentry with 20 years of craft. Crown molding, wainscoting, cabinets, vanities, mantles, drop zones, and custom woodwork — custom-built to fit. Licensed, bonded & insured. Free quotes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
