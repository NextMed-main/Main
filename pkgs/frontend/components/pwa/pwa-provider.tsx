"use client";

import { ServiceWorkerRegister } from "./service-worker-register";

/**
 * PWA Provider Component
 * Wraps PWA-related client components
 */
export function PWAProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceWorkerRegister />
      {children}
    </>
  );
}
