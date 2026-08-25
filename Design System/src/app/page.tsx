import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <div className="space-y-8 max-w-2xl flex flex-col items-center">
          <div className="relative w-32 h-32 overflow-hidden rounded-full border-4 border-primary shadow-xl">
            {/* Usando o componente Image nativo do Next.js (já que o shadcn não tem um de 'img' específico) */}
            <Image 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
              alt="Design Logo"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight text-primary">
              HelpHub Design System
            </h1>
            <p className="text-xl text-muted-foreground">
              Um belo e moderno sistema de design em Next.js com Tailwind CSS e shadcn/ui.
            </p>
          </div>
          
          <div className="flex w-full max-w-sm items-center space-x-2 pt-4">
            <Input type="email" placeholder="Digite seu e-mail..." className="rounded-full shadow-sm" />
            <Button size="default" className="rounded-full shadow-md shadow-primary/30 transition-all hover:scale-105">
              Inscrever
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
