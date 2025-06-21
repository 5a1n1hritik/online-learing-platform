import React, { useState } from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowResend(false);
    setResendStatus("");

    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);

      if (msg === "Please verify your email first") {
        setShowResend(true);
      }
    }
  };

  const handleResendEmail = async () => {
    try {
      setResendStatus("Sending...");
      await API.post("/auth/resend-verification", { email });
      setResendStatus("Verification email sent. Please check your inbox.");
    } catch (err) {
      setResendStatus(
        err.response?.data?.message || "Failed to resend verification email."
      );
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 flex items-center justify-center">
      <Card className="mx-auto max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Login to your account
          </CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
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
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">
                {error}
                {showResend && (
                  <div className="mt-2">
                    <button
                      type="button"
                      className="text-sm text-blue-600 underline"
                      onClick={handleResendEmail}
                    >
                      Resend Verification Email
                    </button>
                  </div>
                )}
              </div>
            )}

            {resendStatus && (
              <div className="text-sm text-green-600">{resendStatus}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Login
            </Button>
          </form>
          <Separator />
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
