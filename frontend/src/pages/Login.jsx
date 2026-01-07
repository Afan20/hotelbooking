import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import { apiPost } from "../api/client.js";
import { setToken } from "../auth/authStorage.js";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("receptionist");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await apiPost("/api/auth/login", { email, password });
      setToken(res.token);
      navigate("/rooms");
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
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-slate-900">Staff Login</h1>
              <p className="mt-1 text-sm text-slate-600">
                Sign in to access bookings and rooms.
              </p>
            </div>

            {error ? (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="e.g. receptionist"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="text-xs text-slate-500">
                Uses the receptionist credentials configured in the backend <code>.env</code>.
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
