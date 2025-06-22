import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import API from "@/api/axios";

const Login = () => {
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [resendStatusType, setResendStatusType] = useState(""); 
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowResend(false);
    setResendStatus("");

    try {
      await login(email, password);
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);

      if (msg === "Please verify your email first") {
        setShowResend(true);
        setResendCooldown(30);
      }
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    setResendStatus("");

    try {
      await API.post("/auth/resend-otp", { email });
      setResendStatus("OTP has been resent. Please check your inbox.");
      setResendStatusType("success");
      setResendCooldown(30);
    } catch (err) {
      setResendStatus(
        err.response?.data?.message || "Failed to resend OTP. Please try again."
      );
      setResendStatusType("error");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password to access your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm space-y-2">
                <p>{error}</p>
                {showResend && (
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendEmail}
                    disabled={resending || resendCooldown > 0}
                    className="text-sm p-0 h-auto"
                  >
                    {resending
                      ? "Sending..."
                      : resendCooldown > 0
                      ? `Resend OTP in ${resendCooldown}s`
                      : "Resend Verification OTP"}
                  </Button>
                )}
              </div>
            )}

            {resendStatus && (
              <div
                className={`text-sm ${
                  resendStatusType === "success" ? "text-green-600" : "text-red-500"
                }`}
              >
                {resendStatus}
              </div>
            )}

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <Separator />
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
