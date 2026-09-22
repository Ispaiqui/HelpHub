import { cn } from "@/lib/utils";

type FieldProps = {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
};

export function Field({ id, label, className, children }: FieldProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none text-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
