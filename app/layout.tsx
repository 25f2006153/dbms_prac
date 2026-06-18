import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";

import { ProgressProvider } from "@/components/progress-provider";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "DBMS Visual Lab | Premium EdTech",
  description: "An interactive, animation-first DBMS learning platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('theme');
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased bg-ink text-slate-100 overflow-x-hidden selection:bg-neonRose/40 selection:text-white transition-colors duration-300">
        <ProgressProvider>
          <div className="relative min-h-screen flex flex-col">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slateNight via-ink to-ink -z-10" />
            <div className="absolute inset-0 bg-grid bg-[size:32px_32px] opacity-[0.02] -z-10" />
            <SiteHeader />
            <main className="flex-1 relative">{children}</main>
          </div>
        </ProgressProvider>
      </body>
    </html>
  );
}
