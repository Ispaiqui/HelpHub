import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { FaviconTheme } from "@/components/helphub/brand";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_URL } from "@/lib/site";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "HelpHub",
  description: "Uma HUB para o seu negócio.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: SITE_URL,
    siteName: "HelpHub",
  },
  icons: {
    icon: [
      {
        url: "/brand/helphub-symbol-light-32.png",
        type: "image/png",
        sizes: "32x32",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/brand/helphub-symbol-dark-32.png",
        type: "image/png",
        sizes: "32x32",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [
      {
        url: "/brand/apple-touch-icon-light-180.png",
        type: "image/png",
        sizes: "180x180",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/brand/apple-touch-icon-dark-180.png",
        type: "image/png",
        sizes: "180x180",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning className={`scroll-smooth ${jetbrainsMono.variable}`}>
      {/* FEATURE FUTURA: Sistema de tela de carregamento ao navegar (overlay +
          interceptação de cliques / eventos de rota). Componentes removidos
          por enquanto; estilos preservados comentados em globals.css. */}
      <body className="min-h-full flex flex-col antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FaviconTheme />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
