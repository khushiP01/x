import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { Toaster } from "@/app/_components/waitlist/sonner";
import "../waitlist.css";

const FigtreeFont = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Join the Waitlist - Standout",
  description: "Join the waitlist to build a real Ivy-Level Capstone project.",
};

export default function WaitlistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${FigtreeFont.className} dark min-h-screen`} suppressHydrationWarning>
      {children}
      <Toaster richColors position="top-center" />
    </div>
  );
}

