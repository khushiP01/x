"use client";

import { usePathname } from "next/navigation";

export function WaitlistWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWaitlist = pathname === "/waitlist";

  if (isWaitlist) {
    return null;
  }

  return <>{children}</>;
}

