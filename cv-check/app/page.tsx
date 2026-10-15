import { Analyzer } from "@/components/Analyzer";

export default function Home() {
  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-5 sm:px-8">
          <span className="text-[15px] font-semibold tracking-tight">
            CV sobivuse kontroll
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pt-10 pb-20 sm:px-8 sm:pt-14">
        <h1 className="max-w-[22ch] text-balance text-[2.25rem] leading-[1.05] font-bold tracking-[-0.025em] sm:text-[3.25rem]">
          Kas su CV sobib sellele tööle?
        </h1>
        <p className="mt-4 max-w-[52ch] text-lg text-ink-muted">
          Kleebi kuulutus ja CV. Tulemus tuleb umbes 15 sekundiga.
        </p>

        <Analyzer />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-6 text-sm text-ink-subtle sm:px-8">
          Tulemuse koostab tehisintellekt. Vaata kaaskiri enne saatmist üle.
        </div>
      </footer>
    </>
  );
}
