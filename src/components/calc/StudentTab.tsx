import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { MONTHS_FI, calcStudentAssessment } from "@/lib/calc";
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
  SliderHeader,
  Stat,
} from "./parts";

export function StudentTab() {
  const { state, update } = useCalculator();
  const s = state.student;
  const set = (patch: Partial<typeof s>) => update("student", { ...s, ...patch });
  const r = calcStudentAssessment(s);
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
      <Panel>
        <PanelTitle step="1">Sinun tilanteesi</PanelTitle>
        <div className="space-y-6">
          <div>
            <SliderHeader label="Tukikuukaudet vuonna 2026" value={`${s.months ?? "–"} kk`} />
            <Slider
              min={0}
              max={12}
              step={1}
              value={[s.months ?? 9]}
              onValueChange={(v) => set({ months: v[0] ?? 9 })}
              aria-label="Tukikuukaudet"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>0 kk</span>
              <span>12 kk</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Laske mukaan kuukaudet, joina saat opintorahaa tai asumislisää. Pelkkä opintolaina ei
              ole tukikuukausi.
            </p>
          </div>
          <NumberField
            label="Opiskelukuukaudet vuonna 2026"
            value={s.studyMonths}
            onChange={(studyMonths) => set({ studyMonths })}
            max={12}
            integer
            suffix="kk"
          />
          {s.months !== null && s.studyMonths !== null && s.months > s.studyMonths && (
            <p role="alert" className="text-sm text-destructive">
              Tukikuukausia ei voi olla opiskelukuukausia enemmän.
            </p>
          )}
          <NumberField
            label="Toteutuneet veronalaiset tulot"
            value={s.earned}
            onChange={(earned) => set({ earned })}
            hint="Vuonna 2026 jo maksetut omat bruttopalkat, veronalaiset pääomatulot ja ulkomaiset tulot. Ei opintorahaa, asumislisää tai opintolainaa."
          />
          <NumberField
            label="Arvioidut tulevat tulot vuonna 2026"
            value={s.future}
            onChange={(future) => set({ future })}
          />
          <div>
            <label htmlFor="current-month" className="mb-2 block text-sm font-semibold">
              Kuluva kuukausi
            </label>
            <select
              id="current-month"
              value={s.currentMonth}
              onChange={(e) => set({ currentMonth: Number(e.target.value) })}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground"
            >
              {MONTHS_FI.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={s.partialYear}
              onChange={(e) => set({ partialYear: e.target.checked })}
              className="mt-1"
            />
            Aloitan opinnot, valmistun tai käytän enimmäistukiajan loppuun vuonna 2026
          </label>
          {s.partialYear && (
            <>
              <NumberField
                label="Opiskeluajan veronalaiset tulot yhteensä"
                value={s.studyIncome}
                onChange={(studyIncome) => set({ studyIncome })}
              />
              <p className="text-xs text-muted-foreground">
                Opiskeluaika määräytyy Kelan sääntöjen mukaan, ei vain nostettujen tukikuukausien
                mukaan. Tavallinen kesätauko tai tuen keskeyttäminen ei oikeuta poikkeukseen. Tulot
                eivät saa ylittää koko vuoden tuloja.
              </p>
            </>
          )}
          <div className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            Vuosituloraja = tukikuukaudet × 1 118 € + tuettomat kuukaudet × 3 355 €. Sallittu ylitys
            on 374 €. Tulot huomioidaan pääosin maksuvuoden mukaan; esimerkiksi luovutusvoitot ja
            yritystulot vaativat erillistä ajankohdan tarkistusta.
          </div>
        </div>
      </Panel>
      <Panel>
        <PanelTitle step="2">Tulos</PanelTitle>
        {!r ? (
          <MissingResult />
        ) : (
          <div className="space-y-5">
            <Stat
              label={
                r.noAid ? "Ei takaisinperittävää opintotukea" : "Henkilökohtainen vuosituloraja"
              }
              value={r.noAid ? "0 kk" : euro(r.limit)}
              size="xl"
              tone="success"
              hint={
                r.noAid
                  ? "Ei opintotuen tulovalvontaa ilman tukikuukausia. Muilla etuuksilla voi olla tulorajoja."
                  : `Sallittu ylitys huomioiden ${euro(r.limitWithMargin)}`
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Stat label="Arvioitu vuositulo" value={euroCents(r.annualIncome)} />
              <Stat
                label="Alitus / ylitys vuosirajaan"
                value={r.noAid ? "Ei sovelleta" : signedEuro(r.annualIncome - r.limit)}
                tone={r.overLimit ? "danger" : "success"}
              />
            </div>
            {!r.noAid && (
              <>
                <div
                  className="h-4 overflow-hidden rounded-full bg-secondary"
                  role="meter"
                  aria-label="Vuositulorajan käyttö"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.min(100, Math.round(r.usage * 100))}
                >
                  <div
                    className={`h-full ${r.overLimit ? "bg-destructive" : "bg-meter"}`}
                    style={{ width: `${Math.min(100, r.usage * 100)}%` }}
                  />
                </div>
                <Stat
                  label="Mahdollisesti takaisinperittäviä tukikuukausia"
                  value={
                    r.recoveredMonths === null ? "Ei määritettävissä" : `${r.recoveredMonths} kk`
                  }
                  tone={r.overLimit ? "danger" : "success"}
                />
                <Stat
                  label="Tulotilaa jäljellä toteutuneiden tulojen jälkeen"
                  value={euroCents(r.roomBeforeForecast)}
                  hint="Vuosituloraja ylitysvaroineen − toteutuneet tulot, vähintään 0 €. Sisältää myös jo ennustetut tulevat tulot."
                />
                <Stat
                  label="Tulotilaa jäljellä myös arvioitujen tulevien tulojen jälkeen"
                  value={euroCents(r.roomAfterForecast)}
                  hint="Vuosituloraja ylitysvaroineen − toteutuneet tulot − arvioidut tulevat tulot, vähintään 0 €. Tämä summa on ansaittavissa ennusteen lisäksi."
                />
                {r.overageWithMargin > 0 && (
                  <Stat
                    label="Arvioidun vuositulon ylitys sallittu ylitys huomioiden"
                    value={euroCents(r.overageWithMargin)}
                    tone="danger"
                  />
                )}
                {r.recommendedMonthly !== null && (
                  <Stat
                    label="Kaikkien tulevien tulojen kuukausibudjetti"
                    value={`${euroCents(r.recommendedMonthly)}/kk`}
                    hint={`${euroCents(r.roomBeforeForecast)} ÷ ${r.remainingMonths} kk. Valittu kuukausi sisältyy jäljellä oleviin kuukausiin. Budjetti sisältää jo ennustetut tulevat tulot; se ei ole ennusteen lisäksi ansaittava summa.`}
                  />
                )}
                <Callout
                  tone={r.overLimit ? "warning" : "success"}
                  icon={
                    r.overLimit ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5" />
                    )
                  }
                >
                  {r.uncertainRecovery
                    ? "Vuosituloraja ja opiskeluajan raja ylittyvät. Takaisinperinnän määrä vaatii Kelan erillisen opiskeluajan tuloselvityksen; euromäärää tai kuukausia ei arvioida."
                    : r.exceptionFits
                      ? `Opiskeluajan tulot mahtuvat rajaan ${euro(r.studyLimit)}. Opintojen aloitus-/päättymisajankohta ja tulot on tarvittaessa osoitettava Kelalle.`
                      : r.overLimit
                        ? `Ylitys ${euroCents(r.overage)} kuuluu Kelan takaisinperintätaulukkoon (2 237 €:n rajat, ensimmäinen raja 374,01 €). Takaisinperintään lisätään 7,5 %. Vapaaehtoista palautusta tarvitaan arviolta ${r.voluntaryMonths} kk; palauta koko kuukauden opintoraha ja asumislisä viimeistään 30.4.2027.`
                        : `Tulot eivät ylitä vuositulorajaa yli 374 eurolla. Ennustetun vuositulon jälkeen tulotilaa on ${euroCents(r.remaining)} sallittu ylitys huomioiden.`}
                </Callout>
                <p className="text-xs text-muted-foreground">
                  Takaisinperinnän euromäärää ei lasketa ilman maksettujen tukikuukausien
                  opintoraha- ja asumislisämääriä. Kela perii viimeisistä maksetuista kuukausista
                  alkaen.
                </p>
              </>
            )}
          </div>
        )}
        <EstimateNotice source="https://www.kela.fi/tulojen-vaikutus-korkeakoulussa" />
        <CopyLinkButton />
      </Panel>
    </div>
  );
}
