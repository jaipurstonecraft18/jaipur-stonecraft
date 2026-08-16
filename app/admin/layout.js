import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin/auth.js";
import AdminLoginPage from "./login/page.js";
import AdminMobileNav from "@/components/admin/AdminMobileNav";
import styles from "./admin.module.css";

export const metadata = {
  title: "Admin Studio | Jaipur Stonecraft",
  robots: { index: false, follow: false }
};

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
  const isAuthenticated = verifySessionToken(sessionToken);

  // If unauthenticated, render Login UI directly without redirect loops
  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  return (
    <div className={styles.adminContainer}>
      <AdminMobileNav />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
