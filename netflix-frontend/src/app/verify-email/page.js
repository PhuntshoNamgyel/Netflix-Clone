"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    if (token) {
      fetch("http://localhost:5000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.message) setStatus("Email verified successfully!");
          else setStatus(data.error || "Verification failed.");
        })
        .catch(() => setStatus("Verification failed. Please try again."));
    } else {
      setStatus("Invalid or missing token.");
    }
  }, [token]);

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h2>Email Verification</h2>
      <p>{status}</p>
    </div>
  );
}