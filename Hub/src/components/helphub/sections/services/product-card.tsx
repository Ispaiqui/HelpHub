import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/helphub/products";

type ProductCardProps = {
  product: Product;
  selected?: boolean;
  onSelect: () => void;
};

export function ProductCard({ product, selected = false, onSelect }: ProductCardProps) {
  const Icon = product.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group h-full w-full origin-center rounded-2xl text-left transition-[transform,opacity] duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        selected
          ? "relative z-10 scale-100 opacity-100"
          : "scale-[0.82] opacity-60 sm:scale-[0.84]",
      )}
    >
      <div
        className={cn(
          "relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-2xl bg-white ring-1 transition-shadow duration-500 sm:min-h-[280px] lg:min-h-[300px] dark:bg-card",
          selected
            ? "shadow-lg ring-slate-300 dark:ring-border"
            : "shadow-sm ring-slate-200/70 dark:ring-border/60",
        )}
      >
        <div
          className={`flex h-20 shrink-0 items-center justify-center bg-gradient-to-br sm:h-24 ${product.color}`}
        >
          <Icon className="h-10 w-10 text-white opacity-90 sm:h-11 sm:w-11" />
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-lg">
            {product.title}
          </h3>
          <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">{product.subtitle}</p>
          <div className="mt-4 flex items-center text-sm font-medium text-primary">
            Ver detalhes
            <ChevronRight className="ml-1 h-4 w-4" />
          </div>
        </div>
      </div>
    </button>
  );
}
