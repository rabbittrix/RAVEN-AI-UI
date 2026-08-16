import { Hero } from "@/components/Hero";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ReleaseDownloadPanel } from "@/components/ReleaseDownloadPanel";
import { Jurisdictions } from "@/components/Jurisdictions";
import { Pillars } from "@/components/Pillars";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TrustFooter } from "@/components/TrustFooter";

export function App() {
  return (
    <div className="bg-mesh min-h-screen">
      <header className="sticky top-0 z-50 border-b border-[color:var(--raven-line)] bg-[color:var(--raven-bg)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <a href="#" className="flex shrink-0 items-center gap-2.5">
            <img
              src={`${import.meta.env.BASE_URL}logo.svg`}
              alt="RAVEN AI logo"
              className="h-8 w-8 shrink-0"
              width={32}
              height={32}
            />
            <span
              className="whitespace-nowrap font-display text-sm font-bold leading-none"
              aria-label="RAVEN AI"
            >
              <span className="tracking-[0.14em]">RAVEN</span>
              <span className="ml-1.5 tracking-[0.12em] text-neon">AI</span>
            </span>
          </a>
          <nav className="flex items-center gap-3">
            <a
              href="#download"
              className="hidden font-mono text-[10px] uppercase tracking-wider text-[color:var(--raven-muted)] hover:text-neon sm:inline"
            >
              Download
            </a>
            <LanguageSwitcher />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main>
        <Hero />
        <Pillars />
        <Jurisdictions />
        <ReleaseDownloadPanel />
      </main>

      <TrustFooter />
    </div>
  );
}
