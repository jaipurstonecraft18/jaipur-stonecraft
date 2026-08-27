import { Cormorant_Garamond, Inter } from "next/font/google";
import PublicShell from "@/components/PublicShell/PublicShell";
import "../styles/globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

import { generateOrganizationSchema } from "@/lib/seo/schemas";

export const metadata = {
  metadataBase: new URL("https://jaipurstonecraft.com"),
  title: "Jaipur Stonecraft",
  description: "Premium stone craftsmanship and custom sculpture atelier.",
};

export default function RootLayout({ children }) {
  const orgSchema = generateOrganizationSchema();

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
