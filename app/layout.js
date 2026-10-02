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
  title: {
    default: "Jaipur Stonecraft — Handcrafted Marble Sculptures, Mandirs & Architectural Stonework",
    template: "%s | Jaipur Stonecraft",
  },
  description: "Premier Indian manufacturer and exporter of bespoke white marble statues, murtis, temple architecture, lattice jalis, courtyard fountains, and custom architectural stonework in Jaipur, Rajasthan.",
  keywords: [
    "Marble Statue Manufacturer Jaipur",
    "Marble Murti Exporter India",
    "Handcrafted Marble Sculptures",
    "Marble Mandir Manufacturer",
    "Stone Jali Screens",
    "Custom Architectural Stonework",
    "Marble Deity Idols",
    "Stone Wall Murals",
    "Jaipur Stonecraft",
  ],
  authors: [{ name: "Jaipur Stonecraft" }],
  creator: "Jaipur Stonecraft",
  publisher: "Jaipur Stonecraft",
  openGraph: {
    title: "Jaipur Stonecraft — Handcrafted Marble Sculptures, Mandirs & Architectural Stonework",
    description: "Premier Indian manufacturer and exporter of bespoke white marble statues, murtis, temple architecture, lattice jalis, courtyard fountains, and custom architectural stonework in Jaipur, Rajasthan.",
    url: "https://jaipurstonecraft.com",
    siteName: "Jaipur Stonecraft",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/collections/hero-sculptures-group.webp",
        width: 1200,
        height: 630,
        alt: "Jaipur Stonecraft Atelier — Master Sculptors in Jaipur, India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaipur Stonecraft — Handcrafted Marble Sculptures & Mandirs",
    description: "Premier Indian manufacturer and exporter of bespoke white marble statues, murtis, temple architecture, and custom architectural stonework in Jaipur, Rajasthan.",
    images: ["/images/collections/hero-sculptures-group.webp"],
  },
  alternates: {
    canonical: "https://jaipurstonecraft.com",
  },
};


export default function RootLayout({ children }) {
  const orgSchema = generateOrganizationSchema();

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
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
