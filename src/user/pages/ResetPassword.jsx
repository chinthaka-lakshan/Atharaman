import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Try multiple ways of getting token/email:
  useEffect(() => {
    // 1) query params (expected: ?token=...&email=...)
    let t = searchParams.get("token");
    let e = searchParams.get("email");

    // 2) fallback: window.location.search (explicit)
    if (!t) {
      const qs = new URLSearchParams(window.location.search);
      t = qs.get("token") || t;
      e = e || qs.get("email");
    }

    // 3) fallback: token in path like /reset-password/<token>
    if (!t) {
      const match = window.location.pathname.match(/reset-password\/([^/?#]+)/);
      if (match && match[1]) {
        try {
          t = decodeURIComponent(match[1]);
        } catch {
          t = match[1];
        }
      }
    }

    // ensure token/email are decoded
    if (t) {
      try {
        t = decodeURIComponent(t);
      } catch {
        // Ignore decoding errors
      }
    }
    if (e) {
      try {
        e = decodeURIComponent(e);
      } catch {
        // Ignore decoding errors
      }
    }

    setToken(t || "");
    setEmail(e || "");
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setMessage("");

    // local checks before calling API
    const localErrors = [];
    if (!token) localErrors.push("Reset token is missing. Open the link from your email.");
    if (!email) localErrors.push("Email is missing. The reset link should include your email.");
    if (!password) localErrors.push("Password is required.");
    if (password !== confirmPassword) localErrors.push("Passwords do not match.");
    if (localErrors.length) {
      setErrors(localErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      };

      // change base URL if you use an env var
      const res = await axios.post(
        "http://127.0.0.1:8000/api/reset-password",
        payload,
        { headers: { Accept: "application/json" } }
      );

      setMessage(res.data?.message || "Password reset successful.");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      // parse Laravel style validation errors (422) or other messages
      const resp = err.response;
      const nextErrors = [];

      if (resp?.status === 422 && resp.data?.errors) {
        // Laravel validation errors object
        const errs = resp.data.errors;
        Object.keys(errs).forEach((k) => {
          if (Array.isArray(errs[k])) nextErrors.push(...errs[k]);
          else nextErrors.push(String(errs[k]));
        });
      } else if (resp?.data?.message) {
        // sometimes messages are in data.message
        nextErrors.push(resp.data.message);
      } else {
        nextErrors.push(err.message || "An unknown error occurred.");
      }

      setErrors(nextErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        {/* show success message */}
        {message && <p className="text-green-600 mb-4">{message}</p>}

        {/* show errors */}
        {errors.length > 0 && (
          <div className="mb-4">
            {errors.map((err, i) => (
              <p key={i} className="text-red-500 text-sm">
                • {err}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display token/email for debugging (optional) */}
          <div className="text-sm text-gray-600">
            <div>Token: {token ? <span className="break-words">{token}</span> : <em>missing</em>}</div>
            <div>Email: {email ? <strong>{email}</strong> : <em>missing</em>}</div>
          </div>

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
            minLength={8}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;