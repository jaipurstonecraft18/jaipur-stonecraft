"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export const GA_MEASUREMENT_ID = "G-2DT7HVKG65";

export default function GoogleAnalytics() {
  const pathname = usePathname();

  // Strict privacy guard: never initialize or track on admin/dashboard routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  );
}
