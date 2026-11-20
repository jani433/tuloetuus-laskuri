import { useState } from "react";
import { AlertTriangle, CalendarClock, CheckCircle2, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  MONTHS_FI,
  STUDENT_LIMIT_FREE_MONTH,
  STUDENT_LIMIT_SUPPORT_MONTH,
  STUDENT_MARGIN,
  calcStudent,
} from "@/lib/calc";
import { euro, num } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Callout, CopyLinkButton, NumberField, Panel, PanelTitle, SliderHeader, Stat } from "./parts";

export function StudentTab() {
  const [months, setMonths] = useState(9);
  const [income, setIncome] = useState(12000);
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth() + 1);
  const r = calcStudent(months, income, currentMonth);

  const pct = Math.min(100, r.usage * 100);
  const limitMarkPct = (r.limit / r.limitWithMargin) * 100;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
      <Panel>
        <PanelTitle step="1">Sinun tilanteesi</PanelTitle>
        <div className="space-y-7">
          <div>
            <SliderHeader label="Tukikuukaudet vuonna 2026" value={`${months} kk`} />
            <Slider
              min={1}
              max={12}
              step={1}
              value={[months]}
              onValueChange={(v) => setMonths(v[0] ?? 9)}
              aria-label="Tukikuukaudet"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>1 kk</span>
              <span>12 kk</span>
            </div>
          </div>
          <NumberField
            label="Arvioitu koko vuoden bruttotulo"
            value={income}
            onChange={setIncome}
            hint="Kaikki vuoden 2026 veronalaiset tulot yhteensä (palkka, keikat, freelance)."
          />
          <div>
            <label
              htmlFor="current-month"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              Kuluva kuukausi
            </label>
            <select
              id="current-month"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(Number(e.target.value))}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base font-medium capitalize text-foreground outline-none focus:border-ring focus:ring-4 focus:ring-ring/15"
            >
              {MONTHS_FI.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            <div className="mb-1 font-semibold text-foreground">Näin raja lasketaan</div>
            {months} × {num(STUDENT_LIMIT_SUPPORT_MONTH)} € + {12 - months} ×{" "}
            {num(STUDENT_LIMIT_FREE_MONTH)} € = <b className="text-foreground">{euro(r.limit)}</b>
            <br />+ ylitysvara {num(STUDENT_MARGIN)} € ={" "}
            <b className="text-foreground">{euro(r.limitWithMargin)}</b>
          </div>
        </div>
      </Panel>

      <Panel className="animate-rise">
        <PanelTitle step="2">Tulos</PanelTitle>

        <Stat
          label={r.overLimit ? "Raja ylittyy" : "Tulorajaa jäljellä"}
          value={r.overLimit ? euro(-r.remaining) : euro(r.remaining)}
          tone={r.overLimit ? "danger" : "success"}
          size="xl"
          hint={
            <>
              Vuosituloraja ylitysvaroineen <b className="text-foreground">{euro(r.limitWithMargin)}</b>
            </>
          }
        />

        <div className="mt-6">
          <div className="relative h-4 overflow-hidden rounded-full bg-secondary">
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-500",
                r.overLimit ? "bg-destructive" : pct > limitMarkPct ? "bg-warning" : "bg-meter",
              )}
              style={{ width: `${pct}%` }}
            />
            <div
              className="absolute inset-y-0 w-0.5 bg-primary/40"
              style={{ left: `${limitMarkPct}%` }}
              aria-hidden
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(r.usage * 100)} % käytetty</span>
            <span>Ylitysvara alkaa {euro(r.limit)}</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted p-4">
            <Stat
              label="Turvallinen keskiarvo"
              value={euro(r.safeMonthly)}
              hint="/ kk koko vuoden"
            />
          </div>
          <div className="rounded-xl bg-accent p-4">
            <Stat
              label="Suositus loppuvuodelle"
              value={euro(r.recommendedMonthly)}
              tone="success"
              hint={`/ kk, ${r.remainingMonths} kk jäljellä`}
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {r.overLimit ? (
            <>
              <Callout
                tone="danger"
                icon={<AlertTriangle className="h-5 w-5" />}
                title={`Raja ylittyy arviolta ${r.exceedMonth ? MONTHS_FI[r.exceedMonth - 1] + "ssa" : "loppuvuonna"}`}
              >
                Ylitys on {euro(r.overage)} vuosirajaan nähden. Kela voi periä takaisin arviolta{" "}
                {r.recoveredMonths} tukikuukautta, ja takaisinperittävään tukeen lisätään{" "}
                <b>7,5 % korotus</b>. Voit välttää korotuksen perumalla tukikuukausia tai
                palauttamalla tukea vapaaehtoisesti.
              </Callout>
            </>
          ) : (
            <Callout
              tone="success"
              icon={<CheckCircle2 className="h-5 w-5" />}
              title="Pysyt tulorajan sisällä"
            >
              Voit tienata vielä {euro(r.remaining)} vuonna 2026 ilman takaisinperintää.
            </Callout>
          )}
          <Callout tone="info" icon={<CalendarClock className="h-5 w-5" />}>
            Laskelma olettaa, että tulot kertyvät tasaisesti koko vuoden. Tukikuukausia voi perua
            tai siirtää OmaKelassa.
          </Callout>
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Opintotuen tulorajaan lasketaan veronalaiset tulot, myös apurahat. Opintolainaa ja
            asumislisää ei lasketa tuloksi.
          </p>
        </div>

        <CopyLinkButton />
      </Panel>
    </div>
  );
}
