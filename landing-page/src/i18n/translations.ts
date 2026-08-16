export type Locale = "en" | "de" | "pt";

export type Translation = {
  tagline: string;
  headline: string;
  subline: string;
  motto: string;
  heroBody: string;
  heroBody2: string;
  cta: string;
  ctaTrial: string;
  pillarsTitle: string;
  pillar1Title: string;
  pillar1Body: string;
  pillar2Title: string;
  pillar2Body: string;
  pillar3Title: string;
  pillar3Body: string;
  jurisdictionsTitle: string;
  jurisdictionsSub: string;
  downloadTitle: string;
  downloadSub: string;
  winLabel: string;
  linuxLabel: string;
  trialNote: string;
  downloadLoading: string;
  downloadError: string;
  downloadEmpty: string;
  downloadEmptyHint: string;
  downloadPickVersion: string;
  downloadAction: string;
  winExe: string;
  winMsi: string;
  linuxDeb: string;
  footerTotal: string;
  footerWin: string;
  footerLinux: string;
  footerLast: string;
  footerLoading: string;
  footerError: string;
  footerRights: string;
};

export const translations: Record<Locale, Translation> = {
  en: {
    tagline: "Brilliant by nature.",
    headline: "Sovereign Intelligence. Deterministic Execution.",
    subline:
      "The first Hybrid AI Engine built in Rust for mission-critical Finance and Law.",
    motto: "Zero Hallucination. Zero Latency. Absolute Compliance.",
    heroBody:
      "While others sell cloud-dependent promises, RAVEN delivers a sovereign, deterministic execution kernel that runs locally on your machine.",
    heroBody2:
      "While others use cloud-wrappers, RAVEN runs locally with O(n) linear efficiency. Zero-hallucination via Rust-compiled legal kernels.",
    cta: "View versions & download",
    ctaTrial: "Download the 3-day Trial. Experience the future of Sovereign AI.",
    pillarsTitle: "The Triple-Pillar Architecture",
    pillar1Title: "Mamba + Transformer",
    pillar1Body:
      "Infinite context with O(n) selective state-space mixing and linear-attention hops — speed without sacrificing reasoning depth.",
    pillar2Title: "Deterministic Proof (DPC)",
    pillar2Body:
      "Every response can be cryptographically signed and legally validated via Rust + WASM jurisdictional kernels — not probabilistic guesswork.",
    pillar3Title: "Neural Vault",
    pillar3Body:
      "Your contracts, embeddings, and compliance traces stay on your hardware. Always offline-capable. Always yours.",
    jurisdictionsTitle: "Global Jurisdictional Coverage",
    jurisdictionsSub:
      "Brazil · Ireland · Germany · Luxembourg · UK · Portugal · Spain · France · Netherlands · Norway · Global ISO",
    downloadTitle: "Ready to test now.",
    downloadSub: "3-day free trial. No cloud lock-in. No pricing page — just performance.",
    winLabel: "Windows (.exe / .msi)",
    linuxLabel: "Ubuntu (.deb)",
    trialNote: "Enterprise MSI and DEB packages built on every release.",
    downloadLoading: "Loading published versions…",
    downloadError: "Could not load releases",
    downloadEmpty: "No installers published yet.",
    downloadEmptyHint:
      "Versioned builds (raven-ai-vX.Y.Z-setup.exe, .msi, _amd64.deb) appear here after the first GitHub Release.",
    downloadPickVersion: "Select a version — click to download",
    downloadAction: "Download",
    winExe: "Windows setup",
    winMsi: "Enterprise MSI",
    linuxDeb: "Ubuntu .deb",
    footerTotal: "Total Downloads",
    footerWin: "Win",
    footerLinux: "Ubuntu",
    footerLast: "Last release",
    footerLoading: "Syncing release telemetry…",
    footerError: "Release stats unavailable",
    footerRights: "© Roberto de Souza. All rights reserved.",
  },
  de: {
    tagline: "Brilliant von Natur.",
    headline: "Souveräne Intelligenz. Deterministische Ausführung.",
    subline:
      "Die erste in Rust entwickelte Hybrid-KI-Engine für geschäftskritische Finanzen und Recht.",
    motto: "Keine Halluzination. Keine Latenz. Absolute Compliance.",
    heroBody:
      "Während andere cloudabhängige Versprechen verkaufen, liefert RAVEN einen souveränen, deterministischen Ausführungskernel — lokal auf Ihrer Maschine.",
    heroBody2:
      "Souveräne Intelligenz. Die erste in Rust entwickelte Hybrid-KI-Engine für geschäftskritische Finanzen und Recht.",
    cta: "Versionen anzeigen & laden",
    ctaTrial:
      "3-Tage-Testversion laden. Erleben Sie die Zukunft souveräner KI.",
    pillarsTitle: "Die Drei-Säulen-Architektur",
    pillar1Title: "Mamba + Transformer",
    pillar1Body:
      "Unendlicher Kontext mit O(n)-Geschwindigkeit durch selektive Zustandsraummodelle und Linear-Attention.",
    pillar2Title: "Deterministischer Beweis (DPC)",
    pillar2Body:
      "Jede Antwort kann kryptografisch signiert und über Rust/WASM-Rechtskernel validiert werden.",
    pillar3Title: "Neural Vault",
    pillar3Body:
      "Ihre Daten bleiben auf Ihrer Hardware. Immer offline-fähig. Immer souverän.",
    jurisdictionsTitle: "Globale Rechtsordnungen",
    jurisdictionsSub:
      "Brasilien · Irland · Deutschland · Luxemburg · UK · Portugal · Spanien · Frankreich · Niederlande · Norwegen · Global ISO",
    downloadTitle: "Jetzt testen.",
    downloadSub: "3 Tage kostenlos. Kein Cloud-Lock-in.",
    winLabel: "Windows (.exe / .msi)",
    linuxLabel: "Ubuntu (.deb)",
    trialNote: "Enterprise-MSI und DEB bei jedem Release.",
    downloadLoading: "Veröffentlichte Versionen werden geladen…",
    downloadError: "Releases konnten nicht geladen werden",
    downloadEmpty: "Noch keine Installer veröffentlicht.",
    downloadEmptyHint:
      "Versionierte Builds (raven-ai-vX.Y.Z-setup.exe, .msi, _amd64.deb) erscheinen nach dem ersten GitHub Release.",
    downloadPickVersion: "Version wählen — zum Download klicken",
    downloadAction: "Download",
    winExe: "Windows Setup",
    winMsi: "Enterprise MSI",
    linuxDeb: "Ubuntu .deb",
    footerTotal: "Downloads gesamt",
    footerWin: "Win",
    footerLinux: "Ubuntu",
    footerLast: "Letztes Release",
    footerLoading: "Release-Daten werden geladen…",
    footerError: "Release-Statistiken nicht verfügbar",
    footerRights: "© Roberto de Souza. Alle Rechte vorbehalten.",
  },
  pt: {
    tagline: "Brilhante por natureza.",
    headline: "Inteligência Soberana. Execução Determinística.",
    subline:
      "O primeiro motor de IA Híbrida construído em Rust para Finanças e Direito de missão crítica.",
    motto: "Zero Alucinação. Zero Latência. Compliance Absoluto.",
    heroBody:
      "Enquanto outros vendem promessas dependentes da nuvem, o RAVEN entrega um kernel de execução soberano e determinístico — local na sua máquina.",
    heroBody2:
      "Inteligência Soberana. Chega de promessas em nuvem. Execute o RAVEN localmente com segurança determinística e latência zero.",
    cta: "Ver versões e baixar",
    ctaTrial:
      "Baixe o trial de 3 dias. Experimente o futuro da IA Soberana.",
    pillarsTitle: "Arquitetura de Três Pilares",
    pillar1Title: "Mamba + Transformer",
    pillar1Body:
      "Contexto infinito com eficiência O(n) — SSM seletivo e atenção linear para velocidade com profundidade.",
    pillar2Title: "Prova Determinística (DPC)",
    pillar2Body:
      "Cada resposta pode ser assinada criptograficamente e validada por kernels jurídicos Rust/WASM.",
    pillar3Title: "Neural Vault",
    pillar3Body:
      "Seus dados ficam no seu hardware. Sempre offline. Sempre seus.",
    jurisdictionsTitle: "Cobertura Jurisdicional Global",
    jurisdictionsSub:
      "Brasil · Irlanda · Alemanha · Luxemburgo · UK · Portugal · Espanha · França · Holanda · Noruega · ISO Global",
    downloadTitle: "Pronto para testar agora.",
    downloadSub: "Trial grátis de 3 dias. Sem lock-in na nuvem.",
    winLabel: "Windows (.exe / .msi)",
    linuxLabel: "Ubuntu (.deb)",
    trialNote: "MSI enterprise e DEB em cada release.",
    downloadLoading: "Carregando versões publicadas…",
    downloadError: "Não foi possível carregar releases",
    downloadEmpty: "Nenhum instalador publicado ainda.",
    downloadEmptyHint:
      "Builds versionados (raven-ai-vX.Y.Z-setup.exe, .msi, _amd64.deb) aparecem após o primeiro GitHub Release.",
    downloadPickVersion: "Selecione uma versão — clique para baixar",
    downloadAction: "Baixar",
    winExe: "Setup Windows",
    winMsi: "MSI Enterprise",
    linuxDeb: "Ubuntu .deb",
    footerTotal: "Downloads totais",
    footerWin: "Win",
    footerLinux: "Ubuntu",
    footerLast: "Último release",
    footerLoading: "Sincronizando telemetria de releases…",
    footerError: "Estatísticas indisponíveis",
    footerRights: "© Roberto de Souza. Todos os direitos reservados.",
  },
};

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  de: "DE",
  pt: "PT",
};
