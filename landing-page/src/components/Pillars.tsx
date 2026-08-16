import { GlassCard } from "@/components/GlassCard";
import { useI18n } from "@/i18n/I18nProvider";

const icons = ["⚡", "🛡", "🔒"];

export function Pillars() {
  const { t } = useI18n();
  const items = [
    { title: t.pillar1Title, body: t.pillar1Body },
    { title: t.pillar2Title, body: t.pillar2Body },
    { title: t.pillar3Title, body: t.pillar3Body },
  ];

  return (
    <section id="architecture" className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-2xl font-bold tracking-tight md:text-3xl">
          {t.pillarsTitle}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <GlassCard key={item.title} delay={i * 0.1}>
              <span className="text-2xl" aria-hidden>
                {icons[i]}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-neon-glow">
                {item.title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-[color:var(--raven-muted)]">
                {item.body}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
