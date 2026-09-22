import type { Metadata } from "next";
import { Catalog } from "@/components/helphub/sections";

export const metadata: Metadata = {
  title: "Demonstrações",
  description:
    "Três pacotes de landing page (Plus, Avançado e Premium). Compare preço, itens e abra a demo do mesmo negócio fictício: Empresa.",
};

export default function DemonstracoesPage() {
  return <Catalog />;
}
