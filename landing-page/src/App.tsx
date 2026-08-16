import { Hero } from "@/components/Hero";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { DownloadSection } from "@/components/DownloadSection";
import { Jurisdictions } from "@/components/Jurisdictions";
import { Pillars } from "@/components/Pillars";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TrustFooter } from "@/components/TrustFooter";

export function App() {
  return (
    <div className="bg-mesh min-h-screen">
      <header className="sticky top-0 z-50 border-b border-[color:var(--raven-line)] bg-[color:var(--raven-bg)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <a href="#" className="flex items-center gap-2">
            <img
              src={`${import.meta.env.BASE_URL}logo.svg`}
              alt=""
              className="h-8 w-8"
              width={32}
              height={32}
            />
            <span className="font-display text-sm font-bold tracking-[0.16em]">
              RAVEN AI
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
        <DownloadSection />
      </main>

      <TrustFooter />
    </div>
  );
}
