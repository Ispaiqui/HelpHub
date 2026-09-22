import { neighborhoods } from "@/lib/demonstracoes/content";
import { cn } from "@/lib/utils";

type NeighborhoodListProps = {
  className?: string;
  itemClassName?: string | ((name: string, index: number) => string);
  renderItem?: (name: string, index: number) => React.ReactNode;
};

export function NeighborhoodList({
  className,
  itemClassName,
  renderItem,
}: NeighborhoodListProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-8 border-t border-line pt-8 text-sm sm:grid-cols-3",
        className,
      )}
    >
      {neighborhoods.map((name, index) => (
        <li
          key={name}
          className={cn(
            "border-b border-line py-3 text-gray-700",
            typeof itemClassName === "function"
              ? itemClassName(name, index)
              : itemClassName,
          )}
        >
          {renderItem ? renderItem(name, index) : name}
        </li>
      ))}
    </ul>
  );
}
