"use client";

import { useEffect } from "react";

export function PWAInit() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registered:", registration.scope);
        })
        .catch((err) => {
          console.log("[PWA] Service Worker registration failed:", err);
        });
    }
  }, []);

  return null;
}
