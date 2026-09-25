import { offerItems } from "@/lib/demonstracoes/content";
import { cn } from "@/lib/utils";

type OfferItem = (typeof offerItems)[number];

type OfferListProps = {
  variant?: "boxed" | "open" | "editorial";
  className?: string;
  rowClassName?: string | ((item: OfferItem, index: number) => string);
  wrapRow?: (
    inner: React.ReactNode,
    item: OfferItem,
    index: number,
    rowClassName: string,
  ) => React.ReactNode;
};

export function OfferList({
  variant = "boxed",
  className,
  rowClassName,
  wrapRow,
}: OfferListProps) {
  const rowBase =
    variant === "editorial"
      ? "grid gap-4 border-t border-ink py-8 last:border-b sm:grid-cols-[14rem_1fr] sm:gap-10"
      : "grid gap-3 px-6 py-8 sm:grid-cols-[16rem_1fr] sm:gap-8 sm:px-8";

  const rows = offerItems.map((item, index) => {
    const classes = cn(
      rowBase,
      typeof rowClassName === "function"
        ? rowClassName(item, index)
        : rowClassName,
    );
    const inner = (
      <>
        <h3
          className={
            variant === "editorial"
              ? "font-serif text-2xl leading-snug sm:text-[1.75rem]"
              : "text-lg font-medium tracking-tight"
          }
        >
          {item.title}
        </h3>
        <p
          className={cn(
            "text-sm leading-7 text-gray-600",
            variant === "editorial" && "self-center",
          )}
        >
          {item.body}
        </p>
      </>
    );

    if (wrapRow) {
      return wrapRow(inner, item, index, classes);
    }

    return (
      <div key={item.title} className={classes}>
        {inner}
      </div>
    );
  });

  if (variant === "editorial") {
    return <div className={cn("mt-12", className)}>{rows}</div>;
  }

  return (
    <div
      className={cn(
        "mt-12 divide-y divide-line",
        variant === "boxed" && "border border-line bg-white",
        variant === "open" && "border border-line",
        className,
      )}
    >
      {rows}
    </div>
  );
}
