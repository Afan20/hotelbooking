import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import { apiPost } from "../api/client.js";
import { setToken } from "../auth/authStorage.js";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/rooms";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await apiPost("/api/auth/login", {
        email: email.trim(),
        password,
      });

      if (!res?.token) throw new Error("Login failed");
      setToken(res.token);
      navigate(from, { replace: true });
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Container>
        <div className="mx-auto mt-16 w-full max-w-md">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">Staff Login</h1>
            <form onSubmit={onSubmit} className="space-y-4 mt-4">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border px-3 py-2 rounded-xl"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border px-3 py-2 rounded-xl"
              />
              <button
                disabled={loading}
                className="w-full bg-slate-900 text-white py-2 rounded-xl"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
