"use client";

import React, { useCallback, useEffect, useRef } from "react";

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	opacity: number;
	life: number;
	maxLife: number;
}

export interface ParticleBackgroundProps {
	particleCount?: number;
	particleColor?: string;
	particleSize?: number;
	speed?: number;
	interactive?: boolean;
	className?: string;
}

// React.memo for optimization (要件 10.3)
export const ParticleBackground = React.memo(function ParticleBackground({
	particleCount = 50,
	particleColor = "#06b6d4",
	particleSize = 2,
	speed = 0.5,
	interactive = true,
	className = "",
}: ParticleBackgroundProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const particlesRef = useRef<Particle[]>([]);
	const mouseRef = useRef({ x: 0, y: 0 });
	const animationFrameRef = useRef<number | undefined>(undefined);
	const prefersReducedMotion = useRef(false);

	// Check for prefers-reduced-motion
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		prefersReducedMotion.current = mediaQuery.matches;

		const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
			prefersReducedMotion.current = e.matches;
		};

		// Check if addEventListener is supported (modern browsers)
		if (mediaQuery.addEventListener) {
			mediaQuery.addEventListener("change", handleChange);
			return () => mediaQuery.removeEventListener("change", handleChange);
		}
	}, []);

	// Initialize particles
	const initParticles = useCallback(
		(width: number, height: number) => {
			const particles: Particle[] = [];
			for (let i = 0; i < particleCount; i++) {
				particles.push({
					x: Math.random() * width,
					y: Math.random() * height,
					vx: (Math.random() - 0.5) * speed,
					vy: (Math.random() - 0.5) * speed,
					size: Math.random() * particleSize + 1,
					opacity: Math.random() * 0.5 + 0.3,
					life: Math.random() * 100,
					maxLife: 100,
				});
			}
			return particles;
		},
		[particleCount, particleSize, speed],
	);

	// Handle mouse move
	const handleMouseMove = useCallback(
		(event: MouseEvent) => {
			if (!interactive) return;
			const canvas = canvasRef.current;
			if (!canvas) return;

			const rect = canvas.getBoundingClientRect();
			mouseRef.current = {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top,
			};
		},
		[interactive],
	);

	// Animation loop
	const animate = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Skip animation if user prefers reduced motion
		if (prefersReducedMotion.current) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			return;
		}

		const { width, height } = canvas;

		// Clear canvas
		ctx.clearRect(0, 0, width, height);

		// Update and draw particles
		particlesRef.current.forEach((particle) => {
			// Update position
			particle.x += particle.vx;
			particle.y += particle.vy;

			// Update life
			particle.life += 1;
			if (particle.life > particle.maxLife) {
				particle.life = 0;
				particle.opacity = Math.random() * 0.5 + 0.3;
			}

			// Calculate fade based on life
			const lifeFactor = 1 - particle.life / particle.maxLife;
			const currentOpacity = particle.opacity * lifeFactor;

			// Interactive: React to mouse
			if (interactive) {
				const dx = mouseRef.current.x - particle.x;
				const dy = mouseRef.current.y - particle.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				const maxDistance = 150;

				if (distance < maxDistance && distance > 0) {
					const force = (maxDistance - distance) / maxDistance;
					particle.vx -= (dx / distance) * force * 0.1;
					particle.vy -= (dy / distance) * force * 0.1;
				}
			}

			// Boundary check and wrap around
			if (particle.x < 0) particle.x = width;
			if (particle.x > width) particle.x = 0;
			if (particle.y < 0) particle.y = height;
			if (particle.y > height) particle.y = 0;

			// Damping to prevent particles from moving too fast
			particle.vx *= 0.99;
			particle.vy *= 0.99;

			// Ensure minimum velocity
			if (Math.abs(particle.vx) < 0.1) {
				particle.vx = (Math.random() - 0.5) * speed;
			}
			if (Math.abs(particle.vy) < 0.1) {
				particle.vy = (Math.random() - 0.5) * speed;
			}

			// Draw particle
			ctx.beginPath();
			ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
			ctx.fillStyle = particleColor;
			ctx.globalAlpha = currentOpacity;
			ctx.fill();

			// Draw glow effect
			const gradient = ctx.createRadialGradient(
				particle.x,
				particle.y,
				0,
				particle.x,
				particle.y,
				particle.size * 3,
			);
			gradient.addColorStop(0, particleColor);
			gradient.addColorStop(1, "transparent");
			ctx.fillStyle = gradient;
			ctx.globalAlpha = currentOpacity * 0.5;
			ctx.fill();
		});

		// Reset global alpha
		ctx.globalAlpha = 1;

		// Continue animation
		animationFrameRef.current = requestAnimationFrame(animate);
	}, [particleColor, speed, interactive]);

	// Setup canvas and start animation
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) {
			console.warn("Canvas 2D context not supported");
			return;
		}

		// Set canvas size
		const updateCanvasSize = () => {
			const dpr = window.devicePixelRatio || 1;
			const rect = canvas.getBoundingClientRect();

			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;

			ctx.scale(dpr, dpr);

			// Reinitialize particles on resize
			particlesRef.current = initParticles(rect.width, rect.height);
		};

		updateCanvasSize();

		// Add event listeners
		window.addEventListener("resize", updateCanvasSize);
		if (interactive) {
			window.addEventListener("mousemove", handleMouseMove);
		}

		// Start animation
		animationFrameRef.current = requestAnimationFrame(animate);

		// Cleanup
		return () => {
			window.removeEventListener("resize", updateCanvasSize);
			if (interactive) {
				window.removeEventListener("mousemove", handleMouseMove);
			}
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [initParticles, animate, handleMouseMove, interactive]);

	return (
		<canvas
			ref={canvasRef}
			className={`pointer-events-none fixed inset-0 z-0 ${className}`}
			style={{
				width: "100%",
				height: "100%",
			}}
			// アクセシビリティ属性（要件 9.5）
			aria-hidden="true"
			role="presentation"
		/>
	);
});
