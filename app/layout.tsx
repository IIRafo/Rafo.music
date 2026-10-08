import "./globals.css";
import "./stems.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import AppProvider from "@/components/AppProvider";

export const metadata: Metadata = {
  title: "Rafo — Beats & Instrumentals",
  description: "Beats e instrumentais originais para artistas. Encontre o som da sua próxima música.",
  openGraph: {
    title: "Rafo — Beats & Instrumentals",
    description: "Beats e instrumentais originais para artistas. Encontre o som da sua próxima música.",
    type: "website",
    locale: "pt_BR",
    // TROCAR: images: ["/images/og.jpg"] (1200x630)
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%2314121a'/%3E%3Cpath d='M14 40V24m9 22V18m9 18V28m9 14V20m9 16V26' stroke='%23b9c7ff' stroke-width='5' stroke-linecap='round'/%3E%3C/svg%3E",
  },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,800&family=Familjen+Grotesk:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
