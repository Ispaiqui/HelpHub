import { Footer, Header } from "@/components/helphub/chrome";

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="hh-page flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
