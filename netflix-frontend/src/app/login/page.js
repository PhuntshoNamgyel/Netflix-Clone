"use client";

import React, { useState } from "react";
import { useAuthStore } from "../../store/auth"; // <-- Import Zustand auth store

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");

  const loginToStore = useAuthStore((state) => state.login); // <-- Zustand login action

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResendError("");
    setMessage("");
    setShowResend(false);
    setResendMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful! Redirecting...");
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          // If your backend responds with user info, use it.
          loginToStore(data.user || { email }, data.accessToken);
        }
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        if (data.error === "Please verify your email before logging in") {
          setError(data.error);
          setShowResend(true);
        } else {
          setError(data.error || "Invalid email or password");
          setShowResend(false);
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
    setError("");
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-600 mb-4">{message}</p>}
        {showResend && (
          <div className="mb-4">
            <button
              type="button"
              className="text-blue-600 hover:underline"
              disabled={loading}
              onClick={handleResendVerification}
            >
              Resend Verification Email
            </button>
            {resendMessage && (
              <p className="text-green-600 mt-2">{resendMessage}</p>
            )}
            {resendError && (
              <p className="text-red-500 mt-2">{resendError}</p>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              autoComplete="username"
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-red-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}