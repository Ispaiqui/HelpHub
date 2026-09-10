import { faqs, type FaqItem } from "@/lib/demonstracoes/content";
import { cn } from "@/lib/utils";

type FaqListProps = {
  className?: string;
  items?: readonly FaqItem[];
};

export function FaqList({ className, items = faqs }: FaqListProps) {
  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item) => (
        <details key={item.q} className="group py-5 sm:py-6">
          <summary className="cursor-pointer list-none text-base font-medium leading-6 text-ink transition-colors duration-200 hover:text-gray-700 marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-start justify-between gap-6">
              {item.q}
              <span
                aria-hidden
                className="mt-1 shrink-0 font-mono text-xs text-gray-400 transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </span>
          </summary>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
