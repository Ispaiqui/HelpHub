import { Hero } from "@/components/helphub/hero";
import { AboutVision } from "@/components/helphub/about-vision";
import { Services } from "@/components/helphub/services";
import { Differential } from "@/components/helphub/differential";

export default function HelpHubPage() {
  // PT-BR: o <main> vem do RootLayout — esta página devolve apenas as seções.
  return (
    <div id="topo">
      <Hero />
      <AboutVision />
      <Services />
      <Differential />
    </div>
  );
}
