import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FormulariosPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6 md:p-12 lg:p-24 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md md:max-w-2xl lg:max-w-4xl space-y-8 md:space-y-10 rounded-2xl md:rounded-3xl bg-card p-8 md:p-12 lg:p-16 shadow-2xl border border-border/50 dark:bg-card/50 backdrop-blur-xl">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Fale Conosco
          </h1>
          <p className="mt-3 md:mt-4 text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Preencha o formulário abaixo para entrar em contato com a equipe HelpHub. Retornaremos o mais breve possível.
          </p>
        </div>

        <form className="mt-8 md:mt-12 space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-3">
              <label htmlFor="name" className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Nome completo
              </label>
              <Input id="name" placeholder="João da Silva" type="text" className="h-12 md:text-base px-4 bg-background/50" required />
            </div>
            
            <div className="space-y-3">
              <label htmlFor="email" className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                E-mail
              </label>
              <Input id="email" placeholder="joao@exemplo.com" type="email" className="h-12 md:text-base px-4 bg-background/50" required />
            </div>
          </div>
            
          <div className="space-y-3">
            <label htmlFor="subject" className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Assunto
            </label>
            <Input id="subject" placeholder="Como podemos ajudar?" type="text" className="h-12 md:text-base px-4 bg-background/50" required />
          </div>
          
          <div className="space-y-3">
            <label htmlFor="message" className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Mensagem
            </label>
            <textarea
              id="message"
              className="flex min-h-[150px] md:min-h-[200px] w-full rounded-lg border border-input bg-background/50 px-4 py-3 text-sm md:text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 resize-y"
              placeholder="Descreva sua solicitação com o máximo de detalhes possível..."
              required
            />
          </div>

          <Button type="submit" className="w-full h-12 md:h-14 text-base md:text-lg font-semibold shadow-lg hover:shadow-primary/25 transition-all" size="lg">
            Enviar Mensagem
          </Button>
        </form>
      </div>
    </main>
  );
}
