import type { Metadata } from "next";
import { Contact } from "@/components/helphub/sections/contact";

export const metadata: Metadata = {
  title: "Fale com a HelpHub",
  description:
    "Envie uma mensagem para a HelpHub. Entraremos em contato em até 1 dia útil.",
};

type FormulariosPageProps = {
  searchParams: Promise<{
    pacote?: string | string[];
    origem?: string | string[];
  }>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function FormulariosPage({ searchParams }: FormulariosPageProps) {
  const params = await searchParams;
  return <Contact defaultPackage={first(params.pacote)} source={first(params.origem)} />;
}
