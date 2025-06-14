"use client";

import React, { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState([]);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Resend states
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setErrorDetails([]);
    setSuccess("");
    setShowResend(false);
    setResendMessage("");
    setResendError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || "User registered successfully. Please check your email for verification.");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        if (data.canResendVerification) {
          setError("User with this email already exists but is not verified.");
          setShowResend(true);
        } else {
          setError(data.error || "Signup failed. Please try again.");
          setShowResend(false);
        }
        if (data.details && Array.isArray(data.details)) {
          setErrorDetails(data.details.map(d => d.msg));
        }
      }
    } catch (err) {
      setError("Network error. Please try again later.");
      setShowResend(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendMessage("");
    setResendError("");
    setResendLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setResendMessage("Verification email resent! Please check your inbox (and spam folder).");
        setShowResend(false);
      } else {
        setResendError(data.error || "Failed to resend verification email.");
      }
    } catch (err) {
      setResendError("Network error. Please try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Signup</h1>

        {/* Success and resend feedback */}
        {success && <p className="text-green-600 mb-4">{success}</p>}
        {resendMessage && <p className="text-green-600 mb-4">{resendMessage}</p>}
        {resendError && <p className="text-red-500 mb-4">{resendError}</p>}

        {/* Error and Resend Button */}
        {error && (
          <div className="mb-2">
            <p className="text-red-500">{error}</p>
            {showResend && (
              <button
                className="w-full bg-yellow-500 text-white mt-2 py-2 px-4 rounded hover:bg-yellow-600"
                onClick={handleResendVerification}
                disabled={resendLoading}
              >
                {resendLoading ? "Resending..." : "Resend Verification Email"}
              </button>
            )}
          </div>
        )}

        {/* Validation details */}
        {errorDetails.length > 0 && (
          <ul className="text-red-500 mb-2 pl-5 list-disc">
            {errorDetails.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-red-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}