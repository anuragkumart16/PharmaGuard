import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

import Header from "@/components/Header";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "PharmaGuard | Pharmacogenomic Risk Engine",
  description: "Advanced pharmacogenomic risk assessment interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased text-text bg-white`}>
        <AuthProvider>
          <div className="app-content relative z-10 min-h-screen flex flex-col">
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
