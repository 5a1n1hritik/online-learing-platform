// pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "@/api/axios";

const VerifyEmail = () => {
  const [status, setStatus] = useState("Verifying...");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("Invalid verification link.");
        return;
      }

      try {
        const res = await API.get(`/auth/verify-email?token=${token}`);

        if (res.status === 200) {
          setStatus("Email verified successfully! Redirecting...");
          setTimeout(() => navigate("/email-verified"), 2000);
        } else {
          setStatus("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Verification error:", error);

        const errorMessage =
          error?.response?.data?.message ||
          "Verification failed. Token may be expired or invalid.";

        setStatus(`${errorMessage}`);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-xl font-bold">{status}</h1>
        {status === "Verifying..." && <p>Please wait...</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;
