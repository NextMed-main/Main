"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, EyeOff } from "lucide-react"
import type { UserRole } from "@/app/page"

interface LoginScreenProps {
  onLogin: (role: UserRole) => void
}

const DEMO_ACCOUNTS = {
  "patient@nextmed.demo": { password: "pass123", role: "patient" as UserRole },
  "researcher@nextmed.demo": { password: "pass123", role: "researcher" as UserRole },
  "company@nextmed.demo": { password: "pass123", role: "institution" as UserRole },
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const account = DEMO_ACCOUNTS[email as keyof typeof DEMO_ACCOUNTS]

    if (account && account.password === password) {
      setError("")
      onLogin(account.role)
    } else {
      setError("Invalid credentials. Use demo accounts below.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-primary">
              <Shield className="h-10 w-10" />
              <span className="text-3xl font-bold">NextMed</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your confidential medical data platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" size="lg">
              Login
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Demo Quick Login</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="grid gap-2">
              <Button variant="outline" onClick={() => onLogin("patient")} className="w-full">
                Login as Patient
              </Button>
              <Button variant="outline" onClick={() => onLogin("researcher")} className="w-full">
                Login as Researcher
              </Button>
              <Button variant="outline" onClick={() => onLogin("institution")} className="w-full">
                Login as Company
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              <span className="font-semibold">Demo Credentials:</span>
              <br />
              Patient: patient@nextmed.demo / pass123
              <br />
              Researcher: researcher@nextmed.demo / pass123
              <br />
              Company: company@nextmed.demo / pass123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
