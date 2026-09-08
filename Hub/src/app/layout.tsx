import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/helphub/header";
import { Footer } from "@/components/helphub/footer";
import { LoadingSystem } from "@/components/helphub/loading-system";
import { ThemeProvider } from "@/components/theme-provider";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HelpHub",
  description: "Uma HUB para o seu negócio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning className={`scroll-smooth ${jetbrainsMono.variable}`}>
      {/* PT-BR: LoadingSystem encapsula toda a aplicação para interceptar
          cliques em links e exibir a tela de carregamento.
          FEATURE FUTURA: Substituir por integração com eventos reais de rota. */}
      <body className="min-h-full flex flex-col antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingSystem>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </LoadingSystem>
        </ThemeProvider>
      </body>
    </html>
  );
}
