import type { Metadata } from "next";
import { WindowManagerProvider } from "@/app/context/WindowManagerContext";
import "./globals.css";

// Metadata = ce que Google et les réseaux sociaux lisent
export const metadata: Metadata = {
  title: {
    // %s sera remplacé par le titre de chaque page
    template: "%s | Yovish MOONESAMY — Portfolio",
    default: "Yovish MOONESAMY — Portfolio",
  },
  description:
    "Portfolio de Yovish MOONESAMY, développeur web en alternance spécialisé en Next.js et TypeScript.",
  keywords: ["développeur web", "Next.js", "TypeScript", "portfolio"],
  authors: [{ name: "Yovish" }],
  // Open Graph = aperçu quand tu partages le lien sur les réseaux
  openGraph: {
    title: "Yovish MOONESAMY — Développeur Web",
    description:
      "Portfolio de Yovish MOONESAMY, développeur web en alternance spécialisé en Next.js et TypeScript.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={'antialiased m-[0] p-[0] w-dvw h-dvh overflow-hidden scroll-smooth overscroll-none cursor-none'}>
        <WindowManagerProvider>{children}</WindowManagerProvider>
      </body>
    </html>
  );
}
