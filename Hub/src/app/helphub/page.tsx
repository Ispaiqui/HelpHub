import { Hero } from "@/components/helphub/hero";
import { AboutVision } from "@/components/helphub/about-vision";
import { Services } from "@/components/helphub/services";
import { Differential } from "@/components/helphub/differential";

export default function HelpHubPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero />
      <AboutVision />
      <Services />
      <Differential />
    </main>
  );
}
