import { lpButtonVariants, type LpButtonVariantProps } from "@/components/demonstracoes/lp-button";
import { WhatsAppIcon } from "@/components/demonstracoes/whatsapp-icon";
import { whatsappHref } from "@/lib/demonstracoes/content";
import { cn } from "@/lib/utils";

type WhatsAppLinkProps = {
  children: React.ReactNode;
  className?: string;
  message?: string;
} & LpButtonVariantProps;

export function WhatsAppLink({
  children,
  className,
  message,
  variant = "solid",
  size = "lg",
}: WhatsAppLinkProps) {
  return (
    <a
      href={whatsappHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(lpButtonVariants({ variant, size }), className)}
    >
      <WhatsAppIcon className="size-4" />
      {children}
    </a>
  );
}
