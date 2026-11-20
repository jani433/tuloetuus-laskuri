import { BellRing } from "lucide-react";
import { calcHousing, HOUSING_GROUPS, housingEstimate } from "@/lib/calc";
import { euro, euroCents, signedEuro } from "@/lib/format";
import { useCalculator } from "./CalculatorContext";
import {
  Callout,
  CopyLinkButton,
  EstimateNotice,
  MissingResult,
  NumberField,
  Panel,
  PanelTitle,
  Stat,
} from "./parts";
const STEPS = [-600, -400, -200, 0, 200, 400, 600];
export function HousingTab() {
  const { state, update } = useCalculator();
  const s = state.housing;
  const set = (patch: Partial<typeof s>) => update("housing", { ...s, ...patch });
  const r = calcHousing(s);
  const bars = STEPS.map((change) => ({ change, result: housingEstimate(s, change) }));
  const max = Math.max(...bars.map((b) => b.result?.estimatedSupport ?? 0), 1);
  const fields = [
    { key: "income", label: "Ruokakunnan kaikki huomioitavat tulot / kk (brutto)" },
    { key: "previousIncome", label: "Tulot edellisen asumistukipäätöksen mukaan / kk" },
    { key: "currentSupport", label: "Nykyinen asumistuki / kk" },
    { key: "rent", label: "Vuokra tai käyttövastike / kk" },
    { key: "water", label: "Erikseen maksettava vesi, yhteensä / kk" },
    { key: "heating", label: "Erikseen maksettava lämmitys / kk" },
    { key: "assets", label: "Muu huomioitava omaisuus" },
    { key: "savings", label: "Talletukset henkilökohtaisten vähennysten jälkeen" },
    { key: "debts", label: "Vähennettävät pitkäaikaiset velat" },
  ] as const;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
      <Panel>
        <PanelTitle step="1">Sinun tilanteesi</PanelTitle>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Aikuiset"
              value={s.adults}
              min={1}
              max={20}
              integer
              suffix="hlö"
              onChange={(adults) => set({ adults })}
            />
            <NumberField
              label="Lapset"
              value={s.children}
              max={20}
              integer
              suffix="hlö"
              onChange={(children) => set({ children })}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Ruokakunta määritellään Kelan sääntöjen mukaan. Yksin tai puolison kanssa asuva
            alaikäinen voidaan laskea aikuiseksi. Opiskelijan asumislisään oikeutetut ja
            eläkkeensaajan asumistuen tilanteet vaativat erillisen tarkistuksen.
          </p>
          <div>
            <label htmlFor="housing-municipality" className="mb-2 block text-sm font-semibold">
              Asuinpaikkakunta / kuntaryhmä
            </label>
            <select
              id="housing-municipality"
              value={s.group}
              onChange={(e) => set({ group: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground"
            >
              <option value="capital">Espoo, Helsinki, Kauniainen tai Vantaa</option>
              <option value="large">Muut nimetyt kaupungit / kunnat</option>
              <option value="other">Muu Manner-Suomen kunta</option>
              <option value="aland">Ahvenanmaa</option>
            </select>
            {s.group === "large" && (
              <p className="mt-2 text-xs text-muted-foreground">{HOUSING_GROUPS.large.label}</p>
            )}
          </div>
          {fields.map((f) => (
            <NumberField
              key={f.key}
              label={f.label}
              value={s[f.key]}
              onChange={(v) => set({ [f.key]: v })}
              hint={
                f.key === "savings"
                  ? "Laske kunkin henkilön huomioitavista talletuksista max(0, talletukset − 2 000 €), ja summaa. Ei ASP-tilejä. Vähennystä ei saa tehdä muusta omaisuudesta."
                  : f.key === "income"
                    ? "Palkat, pääomatulot ja huomioitavat etuudet kaikilta ruokakunnan jäseniltä. Pysyvät tulot vähintään 3 kk; muuten seuraavan 12 kk arvio / 12. Tavallisesti lasten tuloja ei lasketa. Yrittäjällä yleensä YEL/MYEL-tulo. Älä lisää tässä omaisuuden laskennallista tuloa: laskuri lisää sen erikseen."
                    : f.key === "water"
                      ? "0 €, jos sisältyy vuokraan. Enintään 20 €/henkilö/kk."
                      : f.key === "assets"
                        ? "Kelan mukaan huomioitavien varojen arvo, ei näiden talletusten arvoa toistamiseen. Oma käytössä oleva vapaa-ajan asunto ja jakamaton kuolinpesä on rajattu pois."
                        : undefined
              }
            />
          ))}
          <div>
            <label htmlFor="heating-region" className="mb-2 block text-sm font-semibold">
              Lämmityksen alue
            </label>
            <select
              id="heating-region"
              value={s.heatingRegion}
              onChange={(e) => set({ heatingRegion: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground"
            >
              <option value="normal">Muut maakunnat</option>
              <option value="east">Etelä-/Pohjois-Savo tai Pohjois-Karjala</option>
              <option value="north">Pohjois-Pohjanmaa, Kainuu tai Lappi</option>
            </select>
          </div>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={s.extraSpace}
              onChange={(e) => set({ extraSpace: e.target.checked })}
              className="mt-1"
            />
            Kela on hyväksynyt lisätilan tarpeen apuvälineille tai hoitajalle
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={s.special}
              onChange={(e) => set({ special: e.target.checked })}
              className="mt-1"
            />
            Omistusasunto tai epäselvä erityistilanne (sähkö vuokrassa, alivuokraus, ruokakunta tai
            omaisuuden huomiointi)
          </label>
          <p className="text-xs text-muted-foreground">
            Laskenta koskee vuokra-, osaomistus- ja asumisoikeusasuntoja. Sähköä, pysäköintiä,
            saunaa, internetiä tai kalustemaksuja ei hyväksytä erillisinä asumismenoina.
          </p>
        </div>
      </Panel>
      <Panel>
        <PanelTitle step="2">Suuntaa-antava vaikutus</PanelTitle>
        {!r ? (
          s.special ? (
            <Callout tone="warning">
              Omistusasuntoon ei saa yleistä asumistukea. Muut erityistilanteet vaativat
              asumismenojen, ruokakunnan tai omaisuuden tarkistuksen Kelassa; näillä tiedoilla ei
              anneta euromäärää.
            </Callout>
          ) : (
            <MissingResult />
          )
        ) : (
          <div className="space-y-5">
            <Stat
              label="Arvioitu asumistuki"
              value={euroCents(r.estimatedSupport)}
              size="xl"
              tone="success"
              hint="/ kk"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Stat label="Perusomavastuu" value={euroCents(r.deductible)} />
              <Stat
                label="Muutos nykyiseen tukeen"
                value={signedEuro(r.difference)}
                tone={r.difference < 0 ? "danger" : "success"}
              />
            </div>
            <dl className="space-y-3 text-sm">
              {[
                ["Hyväksyttävät asumismenot ennen enimmäisrajaa", r.housingCosts],
                ["Kuntaryhmän enimmäisasumismenot", r.ceiling],
                ["Laskennassa hyväksyttävät asumismenot", r.acceptedCosts],
                ["Huomioitu vesi", r.acceptedWater],
                ["Huomioitu lämmitys", r.acceptedHeating],
                ["Huomioitava nettovarallisuus", r.netAssets],
                ["Omaisuuden laskennallinen kuukausitulo", r.assetIncome],
                ["Tulot laskennassa yhteensä", r.totalIncome],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between gap-3">
                  <dt>{label}</dt>
                  <dd className="shrink-0">{euroCents(Number(value))}</dd>
                </div>
              ))}
            </dl>
            <Callout>
              {s.group === "aland"
                ? "Ahvenanmaa: 80 % × (hyväksytyt asumismenot − perusomavastuu). Omavastuu = max(0, 42 % × [tulot − (667 + 111 × aikuiset + 246 × lapset)])."
                : "Manner-Suomi: 70 % × (hyväksytyt asumismenot − perusomavastuu). Omavastuu = max(0, 50 % × [tulot − (667 + 94 × aikuiset + 296 × lapset)])."}{" "}
              Tuki on vähintään 0 €. Alle 15 €/kk tukea ei makseta.
            </Callout>
            {r.assetExcluded && (
              <Callout tone="warning">
                Huomioitava nettovarallisuus on vähintään 50 000 €, joten yleistä asumistukea ei
                makseta.
              </Callout>
            )}
            {r.belowMinimum && (
              <Callout tone="warning">Laskennallinen määrä jää alle 15 €/kk maksamisrajan.</Callout>
            )}
            <Callout
              tone={r.mustNotify ? "warning" : "success"}
              icon={r.mustNotify ? <BellRing className="h-5 w-5" /> : undefined}
            >
              {r.mustNotify
                ? `Tulot muuttuvat ${signedEuro(r.change)}/kk edelliseen päätökseen verrattuna. Ilmoita vähintään 400 €/kk nousu tai 200 €/kk lasku OmaKelassa.`
                : "Tulojen muutos jää ilmoitusrajojen sisään (nousu alle 400 €/kk ja lasku alle 200 €/kk). Muut muutokset, kuten asumismenot tai ruokakunta, voivat silti vaatia tarkistuksen."}
            </Callout>
            <div>
              <h3 className="mb-3 text-sm font-semibold">Tulojen laskun ja nousun vaikutus</h3>
              <div
                className="flex h-44 items-end gap-2"
                role="img"
                aria-label="Asumistuki tulojen laskiessa ja noustessa"
              >
                {bars.map((b) => (
                  <div key={b.change} className="flex h-full min-w-0 flex-1 flex-col justify-end">
                    <span className="mb-1 text-center text-[10px] font-semibold tabular-nums">
                      {euro(b.result?.estimatedSupport ?? 0)}
                    </span>
                    <div
                      className={`w-full rounded-t-md ${b.change === 0 ? "bg-primary" : b.change < 0 ? "bg-success/50" : "bg-warning/50"}`}
                      style={{
                        height: `${((b.result?.estimatedSupport ?? 0) / max) * 75}%`,
                        minHeight: 3,
                      }}
                    />
                    <span className="mt-2 text-center text-[10px]">
                      {b.change > 0 ? "+" : ""}
                      {b.change}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Tulojen muutos €/kk nykyisestä syötteestä. Tulot eivät laske alle nollan. Muut
                syötteet pidetään samoina; jokainen pylväs lasketaan asumistukikaavalla.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Omaisuuden 10 000 € (yksi aikuinen) / 20 000 € (vähintään kaksi aikuista) ylittävästä
              osasta 20 % vuodessa lisätään tuloksi. Laskelma edellyttää oikein määriteltyä
              ruokakuntaa, tuloja ja varallisuutta. Kelan välipyöristyksiä ja omaisuuden arvostusta
              ei varmistettu julkisista ohjeista.
            </p>
          </div>
        )}
        <EstimateNotice source="https://www.kela.fi/yleinen-asumistuki-maara-ja-maksaminen" />
        <CopyLinkButton />
      </Panel>
    </div>
  );
}
