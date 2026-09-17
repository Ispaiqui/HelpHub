import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/helphub/header";
import { Footer } from "@/components/helphub/footer";
import { FaviconTheme } from "@/components/helphub/favicon-theme";
import { ThemeProvider } from "@/components/theme-provider";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HelpHub",
  description: "Uma HUB para o seu negócio.",
  icons: {
    icon: [
      { url: "/brand/favicon-light.png", type: "image/png", media: "(prefers-color-scheme: light)" },
      { url: "/brand/favicon-dark.png", type: "image/png", media: "(prefers-color-scheme: dark)" },
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
          <Header />
          <main className="hh-page flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
