import { ArrowUpRight, FileText, Globe2, Landmark } from "lucide-react";

const TOOLS = [
  {
    name: "UKKO.fi",
    tag: "Kevytyrittäjyys",
    text: "Laskuta keikat ja freelance-työt ilman omaa yritystä. Palkka ja verot hoituvat puolestasi.",
    href: "https://www.ukko.fi/",
    icon: FileText,
  },
  {
    name: "Wise",
    tag: "Ulkomaan maksut",
    text: "Vastaanota maksuja ulkomailta ja vaihda valuuttaa edullisesti oikeaan kurssiin.",
    href: "https://wise.com/fi/",
    icon: Globe2,
  },
  {
    name: "OmaKela",
    tag: "Viralliset päätökset",
    text: "Ilmoita tulomuutokset, peru tukikuukausia ja tarkista päätöksesi virallisesti.",
    href: "https://www.kela.fi/omakela",
    icon: Landmark,
  },
];

export function ToolCards() {
  return (
    <section aria-labelledby="tools-title" className="mt-14">
      <h2 id="tools-title" className="text-xl font-bold text-foreground">
        Hyödylliset työkalut
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Palveluita, jotka helpottavat sivutulojen kanssa toimimista.
      </p>
      <p className="mt-2 text-xs text-muted-foreground/80">
        Osa linkeistä on kumppanuuslinkkejä, joiden kautta rahoitetaan laskurin
        ylläpitoa ilman lisäkuluja sinulle.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {TOOLS.map((t) => (
          <a
            key={t.name}
            href={t.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group flex flex-col rounded-2xl border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-success/40 hover:shadow-raised"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <t.icon className="h-5 w-5" />
              </span>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-success" />
            </div>
            <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.tag}
            </div>
            <div className="mt-0.5 text-lg font-bold text-foreground">{t.name}</div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
