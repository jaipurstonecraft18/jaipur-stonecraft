"use client";

import styles from "@/app/admin/admin.module.css";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch (e) {
      console.error(e);
    } finally {
      window.location.href = "/admin";
    }
  };

  return (
    <button onClick={handleLogout} className={styles.logoutBtn}>
      Log Out
    </button>
  );
}
