"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import WhatsAppButton from "@/components/WhatsAppButton/WhatsAppButton";
import FloatingSocialButton from "@/components/FloatingSocialButton/FloatingSocialButton";

export default function PublicShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="site-wrapper">
      <Header />
      <main id="main-content" className="main-content">
        {children}
      </main>
      <Footer />
      <FloatingSocialButton />
      <WhatsAppButton />
    </div>
  );
}
