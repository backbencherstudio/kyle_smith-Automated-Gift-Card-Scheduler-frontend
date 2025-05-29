"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedPageWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  // token extract helper
  const getCookieToken = () => {
    if (typeof document === "undefined") return null;

    const cookieString = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("token="));
    return cookieString?.split("=")[1] || null;
  };

  useEffect(() => {
    const token = getCookieToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    setChecking(false);

    // ⏱️ check every 3 seconds if token is still present
    const interval = setInterval(() => {
      const token = getCookieToken();
      if (!token) {
        router.replace("/admin/login");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  if (checking) {
    return null; // or loader
  }

  return <>{children}</>;
}
