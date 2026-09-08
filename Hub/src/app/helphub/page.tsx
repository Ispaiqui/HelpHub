import { AnimatedBackground } from "@/components/helphub/animated-background";
import { Hero } from "@/components/helphub/hero";
import { AboutVision } from "@/components/helphub/about-vision";
import { Services } from "@/components/helphub/services";
import { Differential } from "@/components/helphub/differential";

export default function HelpHubPage() {
  // PT-BR: o <main> vem do RootLayout — esta página devolve apenas as seções.
  return (
    <>
      <AnimatedBackground />
      <Hero />
      <AboutVision />
      <Services />
      <Differential />
    </>
  );
}
