import {
  AboutVision,
  Differential,
  Hero,
  Services,
} from "@/components/helphub/sections";

export default function HelpHubPage() {
  // PT-BR: o <main> vem do layout (hub) — esta página devolve apenas as seções.
  return (
    <div id="topo">
      <Hero />
      <AboutVision />
      <Services />
      <Differential />
    </div>
  );
}
