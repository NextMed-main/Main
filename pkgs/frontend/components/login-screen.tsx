"use client";

import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { UserRole } from "@/app/page";
import { Card } from "@/components/design/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
  onBack?: () => void;
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

export function LoginScreen({ onLogin, onBack }: LoginScreenProps) {
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
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />

      {/* グラスモーフィズムログインカード - Responsive (要件 8.1, 8.2, 8.3) */}
      <Card
        variant="default"
        glow={true}
        hover={false}
        className="w-full max-w-md z-10 p-6 sm:p-8"
      >
        <div className="space-y-4 sm:space-y-6">
          {/* Back to Home Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>
          )}

          {/* ヘッダー - Responsive (要件 8.1) */}
          <div className="space-y-3 sm:space-y-4 text-center">
            <div className="flex justify-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <img
                  src="/logo.jpg"
                  alt="NextMed Logo"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover"
                />
                <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                  NextMed
                </span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 px-2">
              Sign in to access your confidential medical data platform
            </p>
          </div>

          {/* ログインフォーム - Responsive (要件 8.1, 8.5) */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 text-sm">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/20 text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:ring-blue-400 h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 text-sm">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/20 text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:ring-blue-400 h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors touch-manipulation p-2"
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
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full touch-manipulation"
            >
              Login
            </Button>
          </form>

          {/* 区切り線 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">
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
                className="w-full bg-white/5 border-white/20 text-slate-900 hover:bg-white/10 hover:border-blue-300 transition-all h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
              >
                Login as Patient
              </Button>
              <Button
                variant="outline"
                onClick={() => onLogin("researcher")}
                className="w-full bg-white/5 border-white/20 text-slate-900 hover:bg-white/10 hover:border-blue-300 transition-all h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
              >
                Login as Researcher
              </Button>
              <Button
                variant="outline"
                onClick={() => onLogin("institution")}
                className="w-full bg-white/5 border-white/20 text-slate-900 hover:bg-white/10 hover:border-blue-300 transition-all h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
              >
                Login as Company & Clinic
              </Button>
            </div>
          </div>

          {/* デモ認証情報 - Responsive */}
          <div className="pt-3 sm:pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              <span className="font-semibold text-blue-600">
                Demo Credentials:
              </span>
              <br />
              Patient: patient@nextmed.demo / pass123
              <br />
              Researcher: researcher@nextmed.demo / pass123
              <br />
              Company & Clinic: company@nextmed.demo / pass123
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
