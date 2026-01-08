"use client";

import { useState } from "react";
import { ParticleBackground } from "./particle-background";

export function ParticleBackgroundDemo() {
  const [particleCount, setParticleCount] = useState(50);
  const [particleColor, setParticleColor] = useState("#06b6d4");
  const [particleSize, setParticleSize] = useState(2);
  const [speed, setSpeed] = useState(0.5);
  const [interactive, setInteractive] = useState(true);

  return (
    <div className="relative min-h-screen bg-linear-to-br from-[#0a0e27] via-[#060918] to-[#0a0e27]">
      <ParticleBackground
        particleCount={particleCount}
        particleColor={particleColor}
        particleSize={particleSize}
        speed={speed}
        interactive={interactive}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-6 rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
          <h1 className="bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            Particle Background Demo
          </h1>

          <p className="text-gray-300">
            Move your mouse around to interact with the particles. Adjust the
            settings below to customize the effect.
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="particle-count"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Particle Count: {particleCount}
              </label>
              <input
                id="particle-count"
                type="range"
                min="10"
                max="200"
                value={particleCount}
                onChange={(e) => setParticleCount(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="particle-color-picker"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Particle Color
              </label>
              <div className="flex gap-2">
                <input
                  id="particle-color-picker"
                  type="color"
                  value={particleColor}
                  onChange={(e) => setParticleColor(e.target.value)}
                  className="h-10 w-20 cursor-pointer rounded border border-white/20"
                />
                <input
                  id="particle-color-text"
                  type="text"
                  value={particleColor}
                  onChange={(e) => setParticleColor(e.target.value)}
                  className="flex-1 rounded border border-white/20 bg-white/5 px-3 py-2 text-white"
                  aria-label="Particle color hex value"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="particle-size"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Particle Size: {particleSize}
              </label>
              <input
                id="particle-size"
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={particleSize}
                onChange={(e) => setParticleSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="particle-speed"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Speed: {speed.toFixed(1)}
              </label>
              <input
                id="particle-speed"
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="interactive"
                checked={interactive}
                onChange={(e) => setInteractive(e.target.checked)}
                className="h-4 w-4 cursor-pointer"
              />
              <label
                htmlFor="interactive"
                className="cursor-pointer text-sm font-medium text-gray-300"
              >
                Interactive (Mouse Interaction)
              </label>
            </div>
          </div>

          <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
            <h3 className="mb-2 font-semibold text-cyan-400">Features:</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>✓ Canvas API rendering</li>
              <li>✓ requestAnimationFrame optimization</li>
              <li>✓ Mouse interaction with particles</li>
              <li>✓ Smooth fade in/out effects</li>
              <li>✓ Respects prefers-reduced-motion</li>
              <li>✓ Responsive to window resize</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
