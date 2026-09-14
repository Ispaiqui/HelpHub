export const WHATSAPP_NUMBER = "5519999581234";
export const WHATSAPP_DISPLAY = "(19) 99958-1234";

export function whatsappHref(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const whatsappMessages = {
  headerContato:
    "Olá, HelpHub! Quero entrar em contato pelo site.",
  heroEspecialista:
    "Olá, HelpHub! Quero falar com um especialista sobre digitalizar meu negócio.",
  footer:
    "Olá, HelpHub! Vi o WhatsApp no rodapé do site e quero conversar.",
  landingPages:
    "Olá, HelpHub! Tenho interesse em Landing Page para converter visitantes em clientes.",
  sitesInstitucionais:
    "Olá, HelpHub! Quero criar um site institucional profissional para minha empresa.",
  catalogosDigitais:
    "Olá, HelpHub! Quero um catálogo ou cardápio digital com QR Code e WhatsApp.",
  integracoes:
    "Olá, HelpHub! Quero integrar meu site com WhatsApp, formulários e Google Maps.",
  seoManutencao:
    "Olá, HelpHub! Quero melhorar meu posicionamento no Google e manter o site no ar.",
} as const;
