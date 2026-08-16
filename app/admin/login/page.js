"use client";

import { useState } from "react";
import styles from "../admin.module.css";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
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
        setError(data.error || "Authentication failed. Please check your password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>Jaipur Stonecraft</h1>
        <p className={styles.loginSubtitle}>Product Management Studio — Admin Login</p>

        {error && (
          <div style={{ padding: "0.75rem", backgroundColor: "#FCE8E6", color: "#C5221F", borderRadius: "4px", fontSize: "0.85rem", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

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
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.primaryBtn}
            style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}
          >
            {loading ? "Authenticating..." : "Access Studio"}
          </button>
        </form>
      </div>
    </div>
  );
}
