import { Geist, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { ContactFormScript } from "@/components/demonstracoes/contact-form-script";
import "./demonstracoes.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function DemonstracoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`hh-demos ${geistSans.variable} ${instrument.variable} ${plex.variable}`}
    >
      {children}
      <ContactFormScript />
    </div>
  );
}
