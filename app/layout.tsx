import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio de Yovish MOONESAMY - Développeur Web",
  description: "Portfolio de Yovish MOONESAMY - Développeur Web alternant spécialisé en Next.js, React et TypeScript",
  keywords: ["développeur web", "portfolio", "Next.js", "React", "TypeScript", "alternance"],
  authors: [{ name: "Yovish MOONESAMY" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
