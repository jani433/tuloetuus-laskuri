import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, GraduationCap, Home, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentTab } from "@/components/calc/StudentTab";
import { GeneralSupportTab } from "@/components/calc/GeneralSupportTab";
import { HousingTab } from "@/components/calc/HousingTab";
import { ToolCards } from "@/components/calc/ToolCards";

const TITLE = "Sivutulo & Tuet -laskuri 2026";
const DESCRIPTION =
  "Arvioi nopeasti, miten keikkatyö, freelance tai alustatyö vaikuttaa opintotukeen, yleistukeen ja asumistukeen vuonna 2026.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TABS = [
  { value: "student", label: "Opiskelija", sub: "Opintotuki", icon: GraduationCap },
  { value: "jobseeker", label: "Työtön", sub: "Yleistuki", icon: Briefcase },
  { value: "housing", label: "Asumistuki", sub: "Yleinen", icon: Home },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-warning/30 bg-warning-soft">
        <p className="mx-auto flex max-w-5xl items-start gap-2 px-4 py-2.5 text-xs font-medium leading-snug text-warning-foreground sm:items-center sm:text-sm">
          <ShieldCheck className="mt-px h-4 w-4 shrink-0 sm:mt-0" />
          Suuntaa-antava arvio vuoden 2026 sääntöjen mukaan – tarkista virallinen päätös aina
          OmaKelasta.
        </p>
      </div>

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:pt-12">
        <header className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Päivitetty vuoden 2026 säännöillä
          </div>
          <h1 className="text-3xl font-extrabold leading-tight text-primary sm:text-5xl">
            Sivutulo &amp; Tuet
            <span className="text-success"> -laskuri 2026</span>
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
            Katso hetkessä, miten keikkatyö, freelance tai alustatyö vaikuttaa Kelan tukiisi.
          </p>
        </header>

        <Tabs defaultValue="student">
          <TabsList className="mb-5 grid h-auto w-full grid-cols-3 gap-1 rounded-2xl bg-secondary p-1.5">
            {TABS.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="flex h-auto flex-col gap-1 rounded-xl px-2 py-2.5 text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-card sm:flex-row sm:gap-2.5 sm:py-3"
              >
                <t.icon className="h-5 w-5 shrink-0" />
                <span className="flex flex-col leading-tight sm:items-start">
                  <span className="text-sm font-bold">{t.label}</span>
                  <span className="text-[11px] font-medium opacity-70">{t.sub}</span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="student">
            <StudentTab />
          </TabsContent>
          <TabsContent value="jobseeker">
            <GeneralSupportTab />
          </TabsContent>
          <TabsContent value="housing">
            <HousingTab />
          </TabsContent>
        </Tabs>

        <ToolCards />

        <footer className="mt-14 border-t pt-6 text-xs leading-relaxed text-muted-foreground">
          Laskuri on suuntaa-antava eikä korvaa Kelan virallista päätöstä. Kaikki laskenta tapahtuu
          selaimessasi – tietojasi ei tallenneta.
        </footer>
      </main>
    </div>
  );
}
