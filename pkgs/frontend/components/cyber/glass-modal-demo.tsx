"use client";

import {
  GlassModal,
  GlassModalContent,
  GlassModalDescription,
  GlassModalFooter,
  GlassModalHeader,
  GlassModalTitle,
  GlassModalTrigger,
} from "./glass-modal";
import { NeonButton } from "./neon-button";

export function GlassModalDemo() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Glass Modal Variants
        </h2>
        <div className="flex flex-wrap gap-4">
          {/* Default Variant */}
          <GlassModal>
            <GlassModalTrigger asChild>
              <NeonButton variant="primary">Default Modal</NeonButton>
            </GlassModalTrigger>
            <GlassModalContent>
              <GlassModalHeader>
                <GlassModalTitle>Default Glass Modal</GlassModalTitle>
                <GlassModalDescription>
                  This is a glass morphism modal with default styling. It
                  features a semi-transparent background with blur effect.
                </GlassModalDescription>
              </GlassModalHeader>
              <div className="py-4">
                <p className="text-white/80 text-sm">
                  The modal uses backdrop-blur-md and bg-white/10 for the glass
                  effect, with a subtle cyan shadow.
                </p>
              </div>
              <GlassModalFooter>
                <NeonButton variant="secondary" size="sm">
                  Cancel
                </NeonButton>
                <NeonButton variant="primary" size="sm">
                  Confirm
                </NeonButton>
              </GlassModalFooter>
            </GlassModalContent>
          </GlassModal>

          {/* Primary Variant */}
          <GlassModal>
            <GlassModalTrigger asChild>
              <NeonButton variant="primary">Primary Modal</NeonButton>
            </GlassModalTrigger>
            <GlassModalContent variant="primary">
              <GlassModalHeader>
                <GlassModalTitle>Primary Glass Modal</GlassModalTitle>
                <GlassModalDescription>
                  This modal uses the primary color scheme with indigo tones.
                </GlassModalDescription>
              </GlassModalHeader>
              <div className="py-4">
                <p className="text-white/80 text-sm">
                  Perfect for important actions or primary workflows.
                </p>
              </div>
              <GlassModalFooter>
                <NeonButton variant="secondary" size="sm">
                  Cancel
                </NeonButton>
                <NeonButton variant="primary" size="sm">
                  Confirm
                </NeonButton>
              </GlassModalFooter>
            </GlassModalContent>
          </GlassModal>

          {/* Secondary Variant */}
          <GlassModal>
            <GlassModalTrigger asChild>
              <NeonButton variant="secondary">Secondary Modal</NeonButton>
            </GlassModalTrigger>
            <GlassModalContent variant="secondary">
              <GlassModalHeader>
                <GlassModalTitle>Secondary Glass Modal</GlassModalTitle>
                <GlassModalDescription>
                  This modal uses the secondary color scheme with emerald tones.
                </GlassModalDescription>
              </GlassModalHeader>
              <div className="py-4">
                <p className="text-white/80 text-sm">
                  Great for success messages or health-related content.
                </p>
              </div>
              <GlassModalFooter>
                <NeonButton variant="secondary" size="sm">
                  Close
                </NeonButton>
              </GlassModalFooter>
            </GlassModalContent>
          </GlassModal>

          {/* Accent Variant */}
          <GlassModal>
            <GlassModalTrigger asChild>
              <NeonButton variant="accent">Accent Modal</NeonButton>
            </GlassModalTrigger>
            <GlassModalContent variant="accent">
              <GlassModalHeader>
                <GlassModalTitle>Accent Glass Modal</GlassModalTitle>
                <GlassModalDescription>
                  This modal uses the accent color scheme with cyan tones.
                </GlassModalDescription>
              </GlassModalHeader>
              <div className="py-4">
                <p className="text-white/80 text-sm">
                  Ideal for highlighting special features or futuristic
                  elements.
                </p>
              </div>
              <GlassModalFooter>
                <NeonButton variant="accent" size="sm">
                  Got it
                </NeonButton>
              </GlassModalFooter>
            </GlassModalContent>
          </GlassModal>

          {/* Glow Variant */}
          <GlassModal>
            <GlassModalTrigger asChild>
              <NeonButton variant="primary" glow pulse>
                Glow Modal
              </NeonButton>
            </GlassModalTrigger>
            <GlassModalContent variant="accent" glow>
              <GlassModalHeader>
                <GlassModalTitle>Glowing Glass Modal</GlassModalTitle>
                <GlassModalDescription>
                  This modal has an enhanced glow effect for extra emphasis.
                </GlassModalDescription>
              </GlassModalHeader>
              <div className="py-4">
                <p className="text-white/80 text-sm">
                  The glow property adds shadow-2xl for a more dramatic effect.
                </p>
              </div>
              <GlassModalFooter>
                <NeonButton variant="accent" size="sm" glow>
                  Amazing!
                </NeonButton>
              </GlassModalFooter>
            </GlassModalContent>
          </GlassModal>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Modal with Form Example
        </h2>
        <GlassModal>
          <GlassModalTrigger asChild>
            <NeonButton variant="primary">Open Form Modal</NeonButton>
          </GlassModalTrigger>
          <GlassModalContent variant="primary">
            <GlassModalHeader>
              <GlassModalTitle>Patient Data Consent</GlassModalTitle>
              <GlassModalDescription>
                Review and confirm your data sharing preferences for medical
                research.
              </GlassModalDescription>
            </GlassModalHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="research-purpose"
                  className="text-sm font-medium text-white"
                >
                  Research Purpose
                </label>
                <input
                  id="research-purpose"
                  type="text"
                  placeholder="e.g., Cancer research"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-white mb-2">
                  Data Categories
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      className="rounded border-white/20 bg-white/5"
                    />
                    Medical History
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      className="rounded border-white/20 bg-white/5"
                    />
                    Lab Results
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      className="rounded border-white/20 bg-white/5"
                    />
                    Genetic Data
                  </label>
                </div>
              </div>
            </div>
            <GlassModalFooter>
              <NeonButton variant="secondary" size="sm">
                Cancel
              </NeonButton>
              <NeonButton variant="primary" size="sm" glow>
                Grant Consent
              </NeonButton>
            </GlassModalFooter>
          </GlassModalContent>
        </GlassModal>
      </div>
    </div>
  );
}
