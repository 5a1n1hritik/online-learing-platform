import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import API from "@/api/axios";

const VerifyEmail = () => {
  const { state } = useLocation();
  const email = state?.email;
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // resend states
  const [resendStatus, setResendStatus] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (!otp) return;
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await API.post("/auth/verify-otp", { email, otp });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setResendStatus("");
    try {
      await API.post("/auth/resend-otp", { email }); 
      setResendStatus("OTP has been resent. Please check your inbox.");
      setResendCooldown(30); 
    } catch (err) {
      setResendStatus(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-red-500 font-medium text-center">
          No email found. Please register again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent an OTP to <span className="font-semibold">{email}</span>
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              placeholder="Enter the 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading || success}
              maxLength={6}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && (
            <p className="text-sm text-green-600">
              Email verified successfully! Redirecting to login...
            </p>
          )}

          {loading ? (
            <Skeleton className="w-full h-10 rounded bg-muted" />
          ) : (
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleVerify}
              disabled={success}
            >
              Verify & Continue
            </Button>
          )}

          <div className="text-sm text-center mt-2 space-y-1">
            <Button
              variant="link"
              onClick={handleResend}
              disabled={resendCooldown > 0 || resending}
              className="p-0 h-auto"
            >
              {resendCooldown > 0
                ? `Resend OTP in ${resendCooldown}s`
                : resending
                ? "Sending..."
                : "Resend OTP"}
            </Button>
            {resendStatus && (
              <p
                className={`text-sm ${
                  resendStatus.includes("resent")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {resendStatus}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
