import CommandSearchHelper from "@/components/CommandSearchDialog";
import NavBar from "@/components/NavBar";
import { DistributionSystemProvider } from "@/lib/hooks/DistributionSystemContext";
import "@/styles/globals.css";

import { Toaster } from "@/components/ui/sonner";
import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "Model Verification Tool",
  description: "A tool for verifying gas model data",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <main className="to-primary relative flex min-h-screen flex-col gap-4 bg-gradient-to-br from-[#00b7ef] p-4 pb-16">
          <DistributionSystemProvider>
            <NavBar />
            {children}
            <CommandSearchHelper />
          </DistributionSystemProvider>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
