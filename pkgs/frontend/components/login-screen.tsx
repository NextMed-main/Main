"use client";

import type { UserRole } from "@/app/page";
import { GlassCard } from "@/components/cyber/glass-card";
import { NeonButton } from "@/components/cyber/neon-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

const DEMO_ACCOUNTS = {
  "patient@nextmed.demo": { password: "pass123", role: "patient" as UserRole },
  "researcher@nextmed.demo": {
    password: "pass123",
    role: "researcher" as UserRole,
  },
  "company@nextmed.demo": {
    password: "pass123",
    role: "institution" as UserRole,
  },
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const account = DEMO_ACCOUNTS[email as keyof typeof DEMO_ACCOUNTS];

    if (account && account.password === password) {
      setError("");
      onLogin(account.role);
    } else {
      setError("Invalid credentials. Use demo accounts below.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* 背景画像 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background_logo.jpg')" }}
      />
      <div className="absolute inset-0 bg-linear-to-br from-indigo-950/80 via-slate-900/80 to-cyan-950/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
      
      {/* グラスモーフィズムログインカード - Responsive (要件 8.1, 8.2, 8.3) */}
      <GlassCard 
        variant="default" 
        glow={true} 
        hover={false}
        className="w-full max-w-md z-10 p-6 sm:p-8"
      >
        <div className="space-y-4 sm:space-y-6">
          {/* ヘッダー - Responsive (要件 8.1) */}
          <div className="space-y-3 sm:space-y-4 text-center">
            <div className="flex justify-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <img 
                  src="/logo.jpg" 
                  alt="NextMed Logo" 
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover"
                />
                <span className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  NextMed
                </span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-xs sm:text-sm text-gray-300 px-2">
              Sign in to access your confidential medical data platform
            </p>
          </div>

          {/* ログインフォーム - Responsive (要件 8.1, 8.5) */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200 text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/50 h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200 text-sm">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/50 h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors touch-manipulation p-2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-xs sm:text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                {error}
              </p>
            )}
            <NeonButton 
              type="submit" 
              variant="accent" 
              size="lg" 
              glow={true}
              className="w-full touch-manipulation"
            >
              Login
            </NeonButton>
          </form>

          {/* 区切り線 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900/50 px-2 text-gray-400">
                Demo Quick Login
              </span>
            </div>
          </div>

          {/* クイックログインボタン - Responsive (要件 8.1, 8.5) */}
          <div className="space-y-2">
            <div className="grid gap-2">
              <Button
                variant="outline"
                onClick={() => onLogin("patient")}
                className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-cyan-400/50 transition-all h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
              >
                Login as Patient
              </Button>
              <Button
                variant="outline"
                onClick={() => onLogin("researcher")}
                className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-indigo-400/50 transition-all h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
              >
                Login as Researcher
              </Button>
              <Button
                variant="outline"
                onClick={() => onLogin("institution")}
                className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-emerald-400/50 transition-all h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
              >
                Login as Company & Clinic
              </Button>
            </div>
          </div>

          {/* デモ認証情報 - Responsive */}
          <div className="pt-3 sm:pt-4 border-t border-white/20">
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              <span className="font-semibold text-cyan-400">Demo Credentials:</span>
              <br />
              Patient: patient@nextmed.demo / pass123
              <br />
              Researcher: researcher@nextmed.demo / pass123
              <br />
              Company & Clinic: company@nextmed.demo / pass123
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
