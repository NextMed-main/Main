"use client";

import { useEffect } from "react";

/**
 * Service Worker Registration Component
 * Registers the Service Worker for PWA functionality
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    // Only register in production and if Service Worker is supported
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      // Register Service Worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "[PWA] Service Worker registered successfully:",
            registration.scope
          );

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          // Listen for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New Service Worker available
                  console.log("[PWA] New Service Worker available");
                  // You can show an update notification here
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("[PWA] Service Worker registration failed:", error);
        });

      // Handle controller change (when new SW takes over)
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("[PWA] Service Worker controller changed");
        // Optionally reload the page
        // window.location.reload();
      });
    }
  }, []);

  return null;
}
