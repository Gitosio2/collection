import { es } from "@/i18n/es";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
      <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-sky-300">{es.appName}</p>
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{es.home.title}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{es.home.subtitle}</p>
    </main>
  );
}
