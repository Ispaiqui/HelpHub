import type { LucideIcon } from "lucide-react";

type VisionCardProps = {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
};

export function VisionCard({ icon: Icon, title, children }: VisionCardProps) {
  return (
    <div className="relative flex flex-col items-center rounded-2xl bg-card p-8 text-center shadow-sm ring-1 ring-border transition-shadow hover:shadow-md">
      <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mb-4 text-xl font-bold text-foreground">{title}</h3>
      <p className="leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
