import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Briefcase, GraduationCap, Home, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentTab } from "@/components/calc/StudentTab";
import { GeneralSupportTab } from "@/components/calc/GeneralSupportTab";
import { HousingTab } from "@/components/calc/HousingTab";
import { ToolCards } from "@/components/calc/ToolCards";
import { Faq } from "@/components/calc/Faq";
import { CalculatorProvider, useCalculator } from "@/components/calc/CalculatorContext";
import { validateCalculatorState } from "@/lib/calculator-state";

const TITLE = "Sivutulo & Tuet -laskuri 2026 – Laske opintotuen ja yleistuen tulorajat";
const DESCRIPTION =
  "Helppo suomalainen laskuri vuoden 2026 tulorajoille. Katso heti, paljonko voit tienata sivutuloja ennen kuin opintotuki, yleistuki tai asumistuki pienenee.";

export const Route = createFileRoute("/")({
  // Keep only the raw snapshot in the URL; validity is derived, never written back.
  validateSearch: (search: Record<string, unknown>): { data?: unknown } =>
    "data" in search ? { data: search["data"] } : {},
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "google-site-verification",
        content: "v5BvEqRDQX3EaEqEn5lt2R3I76qc8oQ7Xr9NdePtSNE",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tuloetuus-laskuri.vercel.app" },
      { property: "og:locale", content: "fi_FI" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://tuloetuus-laskuri.vercel.app" }],
  }),
  component: Index,
});

const TABS = [
  { value: "student", label: "Opiskelija", sub: "Opintotuki", icon: GraduationCap },
  { value: "jobseeker", label: "Työtön", sub: "Yleistuki", icon: Briefcase },
  { value: "housing", label: "Asumistuki", sub: "Yleinen", icon: Home },
];

function Index() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const key = "data" in search ? JSON.stringify(search.data ?? null) : "";
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const result = useMemo(
    () =>
      "data" in search
        ? validateCalculatorState(search.data ?? null)
        : { data: null, invalid: false },
    [key],
  );
  const [invalid, setInvalid] = useState(false);
  useEffect(() => {
    if (result.invalid) {
      setInvalid(true);
      // Remove the broken snapshot from the address bar right away.
      void navigate({ to: "/", search: {}, replace: true });
    }
  }, [result, navigate]);
  return (
    <CalculatorProvider initial={result.data}>
      <CalculatorPage invalid={invalid} onDismiss={() => setInvalid(false)} />
    </CalculatorProvider>
  );
}

function CalculatorPage({ invalid, onDismiss }: { invalid: boolean; onDismiss: () => void }) {
  const { state, update } = useCalculator();
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

        {invalid && (
          <p
            role="alert"
            className="mb-5 rounded-xl bg-warning-soft p-4 text-sm text-warning-foreground"
          >
            <span className="block font-bold">Jakolinkki oli virheellinen tai vanhentunut.</span>
            Sen tietoja ei käytetty, ja virheelliset tiedot poistettiin osoitteesta. Laskuri näyttää
            oletusarvot.
            <button
              type="button"
              onClick={onDismiss}
              className="mt-2 block font-bold underline underline-offset-2"
            >
              Jatka puhtaalla laskurilla
            </button>
          </p>
        )}
        <Tabs
          value={state.tab}
          onValueChange={(value) => {
            if (value === "student" || value === "jobseeker" || value === "housing")
              update("tab", value);
          }}
        >
          <TabsList className="print:hidden mb-5 grid h-auto w-full grid-cols-3 gap-1 rounded-2xl bg-secondary p-1.5">
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

        <Faq />

        <ToolCards />

        <footer className="mt-14 border-t pt-6 text-xs leading-relaxed text-muted-foreground">
          Laskuri on suuntaa-antava eikä korvaa Kelan virallista päätöstä. Kaikki laskenta tapahtuu
          selaimessasi – tietojasi ei tallenneta.
        </footer>
      </main>
    </div>
  );
}
