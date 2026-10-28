import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  id: string;
  label: string;
  className?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

type ControlProps = {
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

export function Field({ id, label, className, error, hint, children }: FieldProps) {
  const describedBy = [
    error ? `${id}-error` : "",
    hint ? `${id}-hint` : "",
  ].filter(Boolean).join(" ") || undefined;
  const control = isValidElement<ControlProps>(children)
    ? cloneElement(children as ReactElement<ControlProps>, {
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })
    : children;

  return (
    <div className={cn("space-y-3", className)}>
      <label htmlFor={id} className="text-sm font-medium leading-none text-foreground">
        {label}
      </label>
      {control}
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      <p id={`${id}-error`} className="min-h-5 text-sm text-destructive">
        {error ?? "\u00a0"}
      </p>
    </div>
  );
}
