import { testimonial, testimonialShort } from "@/lib/demonstracoes/content";
import { cn } from "@/lib/utils";

type Quote = {
  quote: string;
  name: string;
  role: string;
  place: string;
};

type TestimonialBlockProps = {
  variant: "split" | "compact" | "inline" | "editorial";
  item?: Quote;
  className?: string;
};

export function TestimonialBlock({
  variant,
  item = testimonial,
  className,
}: TestimonialBlockProps) {
  if (variant === "editorial") {
    return (
      <div className={className}>
        <p className="font-serif text-[2.15rem] leading-[1.18] sm:text-5xl sm:leading-[1.15]">
          “{item.quote}”
        </p>
        <p className="label mt-10 text-gray-500">
          {item.name} · {item.role} · {item.place}
        </p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={className}>
        <blockquote className="text-xl leading-8 tracking-tight sm:text-2xl sm:leading-9">
          “{item.quote}”
        </blockquote>
        <p className="mt-6 text-sm leading-6 text-gray-500">
          {item.name}, {item.role} · {item.place}
        </p>
      </div>
    );
  }

  if (variant === "compact") {
    const short = item === testimonial ? testimonialShort : item;
    return (
      <figure className={cn("border border-line bg-white p-7 sm:px-12 sm:py-8", className)}>
        <blockquote>
          <p className="text-base leading-7 tracking-tight text-gray-700 sm:text-lg">
            “{short.quote}”
          </p>
        </blockquote>
        <figcaption className="mt-4 text-sm leading-6 text-gray-500">
          {short.name}, {short.role} · {short.place}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure
      className={cn(
        "grid gap-8 border border-line bg-white p-7 sm:p-12 md:grid-cols-[2fr_1fr] md:gap-10",
        className,
      )}
    >
      <blockquote>
        <p className="text-xl leading-8 tracking-tight sm:text-2xl sm:leading-9">
          “{item.quote}”
        </p>
      </blockquote>
      <figcaption className="self-end text-sm leading-6 text-gray-500 md:border-l md:border-line md:pl-10">
        <p className="font-medium text-ink">{item.name}</p>
        <p className="mt-1">
          {item.role} · {item.place}
        </p>
      </figcaption>
    </figure>
  );
}
