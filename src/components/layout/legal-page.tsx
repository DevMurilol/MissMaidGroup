import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white py-20 sm:py-28">
        <Container className="max-w-3xl">
          <h1 className="font-heading text-3xl font-bold text-neutral-900 sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-neutral-500">Last updated: {updated}</p>
          <div className="prose-legal mt-10 flex flex-col gap-6 text-sm leading-relaxed text-neutral-700">
            {children}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
