import { cn } from "@/lib/utils";

type ContactFormProps = {
  className?: string;
  tone?: "plain" | "panel" | "editorial";
  submitLabel?: string;
};

export function ContactForm({
  className,
  tone = "plain",
  submitLabel = "Enviar",
}: ContactFormProps) {
  return (
    <div
      data-contato-widget
      className={cn(
        "grid gap-5",
        tone === "panel" && "border border-line bg-white p-6 sm:p-8",
        tone === "editorial" && "border-t border-ink pt-10",
        className,
      )}
    >
      <div
        data-contato-success
        hidden
        role="status"
        className="border border-ink bg-ink p-6 text-paper sm:p-8"
      >
        <p className="text-lg font-medium">Pedido registrado nesta demo.</p>
        <p className="mt-2 text-sm leading-6 text-gray-200">
          No site real, isso iria para a empresa. WhatsApp continua sendo o
          caminho mais rápido.
        </p>
        <button
          type="button"
          data-contato-reset
          className="mt-6 inline-flex h-12 items-center justify-center bg-paper px-6 text-sm font-medium text-ink"
        >
          Escrever outra mensagem
        </button>
      </div>

      <div data-contato-fields className="grid gap-5">
        <p
          data-contato-banner
          hidden
          role="alert"
          className="border border-ink bg-gray-50 px-3 py-2 text-sm font-medium text-ink"
        >
          Revise os campos marcados antes de enviar.
        </p>

        <label className="grid gap-1.5">
          <span className="label text-gray-600">Nome</span>
          <input
            name="nome"
            autoComplete="off"
            placeholder="Seu nome"
            className="h-12 w-full border border-line bg-white px-3.5 text-base text-ink placeholder:text-gray-400 focus-visible:border-ink focus-visible:outline-none"
          />
          <span data-error-for="nome" hidden className="text-sm font-medium text-ink">
            Escreva seu nome.
          </span>
        </label>

        <label className="grid gap-1.5">
          <span className="label text-gray-600">Telefone</span>
          <input
            name="telefone"
            type="tel"
            inputMode="tel"
            autoComplete="off"
            placeholder="(11) 99999-9999"
            data-contato-phone
            className="h-12 w-full border border-line bg-white px-3.5 text-base text-ink placeholder:text-gray-400 focus-visible:border-ink focus-visible:outline-none"
          />
          <span
            data-error-for="telefone"
            hidden
            className="text-sm font-medium text-ink"
          >
            Telefone com DDD, 10 ou 11 dígitos.
          </span>
        </label>

        <label className="grid gap-1.5">
          <span className="label text-gray-600">Mensagem</span>
          <textarea
            name="mensagem"
            autoComplete="off"
            placeholder="Ex.: preciso de atendimento na Região Norte, de preferência esta semana."
            className="min-h-32 w-full resize-y border border-line bg-white px-3.5 py-3 text-base text-ink placeholder:text-gray-400 focus-visible:border-ink focus-visible:outline-none"
          />
          <span
            data-error-for="mensagem"
            hidden
            className="text-sm font-medium text-ink"
          >
            Descreva o que está acontecendo, em poucas frases.
          </span>
        </label>

        <button
          type="button"
          data-testid="contato-enviar"
          className="inline-flex h-12 w-full items-center justify-center bg-ink px-6 text-sm font-medium text-paper sm:w-auto"
        >
          {submitLabel}
        </button>
        <p className="text-xs leading-5 text-gray-500">
          Demo sem backend: validamos aqui e mostramos a confirmação. WhatsApp
          é o canal real desta empresa.
        </p>
      </div>
    </div>
  );
}
