import { Slider } from "@/components/ui/slider";
import { calcGeneralSupport, GENERAL_SUPPORT_DEFAULT_MONTHLY } from "@/lib/calc";
import { euro, euroCents, signedEuro } from "@/lib/format";
import type { IncomeType } from "@/lib/calculator-state";
import { useCalculator } from "./CalculatorContext";
import {
  Callout,
  CopyLinkButton,
  EstimateNotice,
  MissingResult,
  NumberField,
  Panel,
  PanelTitle,
  SliderHeader,
  Stat,
} from "./parts";
const TYPES: { value: IncomeType; label: string }[] = [
  { value: "none", label: "Ei muita tuloja" },
  { value: "wage", label: "Palkkatulo" },
  { value: "capital", label: "Pääomatulo" },
  { value: "rent", label: "Vuokratulo" },
  { value: "other", label: "Muu kuin palkkatulo" },
  { value: "mixed", label: "Useita tulolajeja" },
];
export function GeneralSupportTab() {
  const { state, update } = useCalculator();
  const s = state.general;
  const set = (patch: Partial<typeof s>) => update("general", { ...s, ...patch });
  const r = calcGeneralSupport(s);
  const fields = [
    { key: "wages", label: "Palkkatulo / kk (brutto)", type: "wage" },
    { key: "capital", label: "Pääomatulo / kk", type: "capital" },
    { key: "rent", label: "Vuokratulo / kk (vähennettävien kulujen jälkeen)", type: "rent" },
    { key: "other", label: "Muu tarveharkintatulo / kk", type: "other" },
  ] as const;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
      <Panel>
        <PanelTitle step="1">Sinun tilanteesi</PanelTitle>
        <div className="space-y-6">
          <NumberField
            label="Yleistuki ennen tulovähennyksiä / kk"
            value={s.support}
            max={GENERAL_SUPPORT_DEFAULT_MONTHLY}
            onChange={(support) => set({ support })}
            hint="Täysi tuki 37,21 €/pv, keskimäärin 800,02 €/kk (21,5 päivää). Keskimääräinen kuukausiarvio, ei neljän viikon maksuerä."
          />
          <div>
            <label htmlFor="income-type" className="mb-2 block text-sm font-semibold">
              Tulolaji
            </label>
            <select
              id="income-type"
              value={s.type}
              onChange={(e) => {
                const type = TYPES.find((t) => t.value === e.target.value)?.value;
                if (type) set({ type, wages: 0, capital: 0, rent: 0, other: 0 });
              }}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground"
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          {fields
            .filter((f) => s.type === "mixed" || s.type === f.type)
            .map((f) => (
              <div key={f.key}>
                <NumberField
                  label={f.label}
                  value={s[f.key]}
                  onChange={(v) => set({ [f.key]: v })}
                />
                {f.key === "wages" && (
                  <div className="mt-3 print:hidden">
                    <SliderHeader label="Palkkatulo" value={euro(s.wages ?? 0)} />
                    <Slider
                      min={0}
                      max={2000}
                      step={10}
                      value={[Math.min(s.wages ?? 0, 2000)]}
                      onValueChange={(v) => set({ wages: v[0] ?? 0 })}
                      aria-label="Sivutulo kuukaudessa"
                    />
                  </div>
                )}
              </div>
            ))}
          <NumberField
            label="Suoraan vähennettävät muut etuudet / kk"
            value={s.benefits}
            onChange={(benefits) => set({ benefits })}
            hint="Vain Kelan suoraan vähennettäväksi vahvistamat etuudet, esimerkiksi kotihoidon tuki. Älä lisää asumistukea, lapsilisää, elatustukea, toimeentulotukea tai vammaistukea."
          />
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={s.special}
              onChange={(e) => set({ special: e.target.checked })}
              className="mt-1"
            />
            Erityistilanne: asun vanhempien luona, osallistun työllistymistä edistävään palveluun,
            saan eläkettä tai etuuden vaikutus on epäselvä
          </label>
          <p className="text-xs text-muted-foreground">
            Yleistuki on voimassa 1.5.2026 alkaen. Palkka sovitellaan maksujakson mukaan.
            Säännölliset pääoma- ja muut tarveharkintatulot arvioidaan kuukausituloiksi,
            tarvittaessa vuosimäärä / 12. Yritystoiminnan ja työajan vaikutus oikeuteen on
            tarkistettava erikseen.
          </p>
        </div>
      </Panel>
      <Panel>
        <PanelTitle step="2">Tulos</PanelTitle>
        {!r ? (
          s.special ? (
            <Callout tone="warning">
              Erityistilanne vaatii Kelan arvion. Vanhempien tulot, palvelujaksot ja etuuksien tai
              eläkkeen laji voivat muuttaa sääntöjä. Näillä tiedoilla ei anneta euromäärää.
            </Callout>
          ) : (
            <MissingResult />
          )
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl bg-hero p-5 text-primary-foreground shadow-raised">
              <Stat
                label="Arvioitu yleistuki kuukaudessa"
                value={euroCents(r.adjustedSupport)}
                size="xl"
                tone="inverse"
                hint="Brutto, keskimääräinen kuukausi"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Stat label="Tulot yhteensä" value={euroCents(r.total)} tone="success" />
              <Stat
                label="Lisätulojen hyöty ennen veroja"
                value={signedEuro(r.gain)}
                hint="Verrattuna tilanteeseen ilman palkka- ja tarveharkintatuloja, muut etuudet ennallaan."
              />
            </div>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between gap-3 text-xs text-muted-foreground">
                  <span>Ilman lisätuloja (muut etuudet ennallaan)</span>
                  <span>{euroCents(r.baseline)}</span>
                </div>
                <div className="h-7 overflow-hidden rounded-lg bg-secondary">
                  <div
                    className="h-full bg-primary/25"
                    style={{
                      width: `${(r.baseline / Math.max(r.total, r.baseline, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Lisätulojen kanssa</span>
                  <span>{euroCents(r.total)}</span>
                </div>
                <div className="flex h-7 overflow-hidden rounded-lg bg-secondary">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${(r.adjustedSupport / Math.max(r.total, r.baseline, 1)) * 100}%`,
                    }}
                  />
                  <div
                    className="h-full bg-success"
                    style={{
                      width: `${((r.total - r.adjustedSupport) / Math.max(r.total, r.baseline, 1)) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                  <span>Yleistuki</span>
                  <span>Muut tulot ja etuudet</span>
                </div>
              </div>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt>Palkkatulon vähennys (50 %)</dt>
                <dd>{euroCents(r.wageReduction)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Tarveharkintatulot yhteensä</dt>
                <dd>{euroCents(r.meansIncome)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Tarveharkinnan tuloraja</dt>
                <dd>{euro(r.usedLimit)}/kk</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Tarveharkinnan vähennys</dt>
                <dd>{euroCents(r.meansReduction)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Muiden etuuksien suora vähennys</dt>
                <dd>{euroCents(r.benefitReduction)}</dd>
              </div>
              <div className="flex justify-between gap-3 font-bold">
                <dt>Tuen vähennys yhteensä (enintään tuen määrä)</dt>
                <dd>{euroCents(r.reduction)}</dd>
              </div>
            </dl>
            <Callout>
              Arvio = {euroCents(s.support ?? 0)} − {euroCents(r.wageReduction)} −{" "}
              {euroCents(r.meansReduction)} − {euroCents(r.benefitReduction)}, vähintään 0 €.
              Palkalla ei ole suojaosaa. Muiden tarveharkintatulojen yhteenlasketusta 311 €/kk
              ylittävästä osasta vähennetään 50 %.
            </Callout>
            <p className="text-xs text-muted-foreground">
              Ei yleistä 35 %:n vähimmäistukea: se liittyy vain vanhempien tulojen erityissääntöön.
              Julkisista Kelan ohjeista ei varmistettu yleistä pienen maksun alarajaa. Maksupäivät,
              työaika, tarveharkinnan kohdistus ja yhteisvähennysten pyöristys vaativat Kelan
              päätöksen.
            </p>
          </div>
        )}
        <EstimateNotice source="https://www.kela.fi/yleistuki" />
        <CopyLinkButton />
      </Panel>
    </div>
  );
}
