"use client";

import { GlassCard } from "./glass-card";

export function GlassCardDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white mb-8">
          GlassCard Component Demo
        </h1>

        {/* Default variant */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Default Variant
          </h2>
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-2">
              Default Glass Card
            </h3>
            <p className="text-gray-300">
              This is a default glass card with backdrop-blur-md and bg-white/10
              transparency.
            </p>
          </GlassCard>
        </div>

        {/* Primary variant */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Primary Variant
          </h2>
          <GlassCard variant="primary" className="p-6">
            <h3 className="text-xl font-bold text-white mb-2">
              Primary Glass Card
            </h3>
            <p className="text-gray-300">
              This card uses indigo colors with a purple glow effect.
            </p>
          </GlassCard>
        </div>

        {/* Secondary variant */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Secondary Variant
          </h2>
          <GlassCard variant="secondary" className="p-6">
            <h3 className="text-xl font-bold text-white mb-2">
              Secondary Glass Card
            </h3>
            <p className="text-gray-300">
              This card uses emerald green colors for a medical/health theme.
            </p>
          </GlassCard>
        </div>

        {/* Accent variant */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Accent Variant
          </h2>
          <GlassCard variant="accent" className="p-6">
            <h3 className="text-xl font-bold text-white mb-2">
              Accent Glass Card
            </h3>
            <p className="text-gray-300">
              This card uses cyan colors for a futuristic neon effect.
            </p>
          </GlassCard>
        </div>

        {/* With glow effect */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            With Glow Effect
          </h2>
          <GlassCard variant="accent" glow className="p-6">
            <h3 className="text-xl font-bold text-white mb-2">
              Glass Card with Glow
            </h3>
            <p className="text-gray-300">
              This card has an enhanced shadow-2xl glow effect.
            </p>
          </GlassCard>
        </div>

        {/* Without hover effect */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Without Hover Effect
          </h2>
          <GlassCard variant="primary" hover={false} className="p-6">
            <h3 className="text-xl font-bold text-white mb-2">
              Static Glass Card
            </h3>
            <p className="text-gray-300">
              This card does not scale or change on hover.
            </p>
          </GlassCard>
        </div>

        {/* Grid layout example */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Grid Layout Example
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlassCard variant="default" className="p-6">
              <h3 className="text-lg font-bold text-white mb-2">Card 1</h3>
              <p className="text-gray-300 text-sm">
                Default variant with hover effect
              </p>
            </GlassCard>
            <GlassCard variant="primary" className="p-6">
              <h3 className="text-lg font-bold text-white mb-2">Card 2</h3>
              <p className="text-gray-300 text-sm">
                Primary variant with indigo glow
              </p>
            </GlassCard>
            <GlassCard variant="secondary" className="p-6">
              <h3 className="text-lg font-bold text-white mb-2">Card 3</h3>
              <p className="text-gray-300 text-sm">
                Secondary variant with emerald glow
              </p>
            </GlassCard>
            <GlassCard variant="accent" glow className="p-6">
              <h3 className="text-lg font-bold text-white mb-2">Card 4</h3>
              <p className="text-gray-300 text-sm">
                Accent variant with enhanced glow
              </p>
            </GlassCard>
            <GlassCard variant="primary" glow className="p-6">
              <h3 className="text-lg font-bold text-white mb-2">Card 5</h3>
              <p className="text-gray-300 text-sm">Primary with glow effect</p>
            </GlassCard>
            <GlassCard variant="secondary" glow className="p-6">
              <h3 className="text-lg font-bold text-white mb-2">Card 6</h3>
              <p className="text-gray-300 text-sm">
                Secondary with glow effect
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
