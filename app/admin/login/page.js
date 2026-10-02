"use client";

import { useState, useEffect } from "react";
import styles from "../admin.module.css";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [lockType, setLockType] = useState(null);

  // Active countdown timer effect
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setLockType(null);
          setError("Cooldown complete. You may now test your password again.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (countdown > 0) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/admin";
      } else {
        if (data.retryAfter && data.retryAfter > 0) {
          setCountdown(data.retryAfter);
          setLockType(data.lockType || "short");
        }
        setError(data.error || "Authentication failed. Please check your password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>Jaipur Stonecraft</h1>
        <p className={styles.loginSubtitle}>Product Management Studio — Admin Login</p>

        {countdown > 0 ? (
          <div
            style={{
              padding: "0.85rem 1rem",
              backgroundColor: lockType === "long" ? "#FCE8E6" : "#FEF7E0",
              color: lockType === "long" ? "#C5221F" : "#B06000",
              border: `1px solid ${lockType === "long" ? "#F5C6CB" : "#FEEAA0"}`,
              borderRadius: "6px",
              fontSize: "0.88rem",
              marginBottom: "1.25rem",
              lineHeight: 1.4
            }}
          >
            <strong>{lockType === "long" ? "🔒 Security Lockout Active" : "⏳ 30-Second Security Cooldown"}</strong>
            <div style={{ marginTop: "0.35rem" }}>
              Please wait <strong>{formatCountdown(countdown)}</strong> before entering your password again.
              {lockType === "short" && (
                <div style={{ marginTop: "0.25rem", fontSize: "0.8rem", color: "#666" }}>
                  After this countdown, you will have 3 additional trials.
                </div>
              )}
            </div>
          </div>
        ) : error ? (
          <div
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: "#FCE8E6",
              color: "#C5221F",
              borderRadius: "6px",
              fontSize: "0.85rem",
              marginBottom: "1rem",
              lineHeight: 1.4
            }}
          >
            {error}
          </div>
        ) : null}

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup} style={{ marginBottom: "1.25rem" }}>
            <label className={styles.label} htmlFor="password">
              Admin Master Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className={styles.input}
              disabled={loading || countdown > 0}
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || countdown > 0}
            className={styles.primaryBtn}
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "0.75rem",
              opacity: countdown > 0 ? 0.6 : 1,
              cursor: countdown > 0 ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Authenticating..." : countdown > 0 ? `Please wait ${formatCountdown(countdown)}` : "Access Studio"}
          </button>
        </form>
      </div>
    </div>
  );
}
