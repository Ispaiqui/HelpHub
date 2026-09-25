import { ErrorScreen } from "@/components/helphub/error";

export default function NotFound() {
  return (
    <ErrorScreen
      statusCode={404}
      title="Página não encontrada"
      description="A página que você está procurando não existe ou foi movida para outro endereço."
    />
  );
}
