import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/helphub/header";
import { Footer } from "@/components/helphub/footer";
import { LoadingSystem } from "@/components/helphub/loading-system";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
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
    <html lang="pt-br" className={`scroll-smooth ${inter.variable}`}>
      {/* PT-BR: LoadingSystem encapsula toda a aplicação para interceptar
          cliques em links e exibir a tela de carregamento.
          FEATURE FUTURA: Substituir por integração com eventos reais de rota. */}
      <body className="min-h-full flex flex-col antialiased font-sans">
        <LoadingSystem>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </LoadingSystem>
      </body>
    </html>
  );
}
