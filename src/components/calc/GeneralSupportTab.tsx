import { useState } from "react";
import { Info, TrendingUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { GENERAL_SUPPORT_DAILY, GENERAL_SUPPORT_DEFAULT_MONTHLY, calcGeneralSupport } from "@/lib/calc";
import { euro, euroCents, signedEuro } from "@/lib/format";
import { Callout, NumberField, Panel, PanelTitle, SliderHeader, Stat } from "./parts";

export function GeneralSupportTab() {
  const [support, setSupport] = useState(GENERAL_SUPPORT_DEFAULT_MONTHLY);
  const [income, setIncome] = useState(600);
  const r = calcGeneralSupport(support, income);

  const max = Math.max(r.total, support, 1);
  const supportPct = (r.adjustedSupport / max) * 100;
  const incomePct = (income / max) * 100;
  const basePct = (support / max) * 100;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
      <Panel>
        <PanelTitle step="1">Sinun tilanteesi</PanelTitle>
        <div className="space-y-7">
          <NumberField
            label="Nykyinen yleistuki / kk"
            value={support}
            onChange={setSupport}
            hint={`Täysi yleistuki ${euroCents(GENERAL_SUPPORT_DAILY)}/pv ≈ ${euro(GENERAL_SUPPORT_DEFAULT_MONTHLY)}/kk.`}
          />
          <div>
            <SliderHeader label="Sivutulo / kk (brutto)" value={euro(income)} />
            <Slider
              min={0}
              max={2000}
              step={10}
              value={[income]}
              onValueChange={(v) => setIncome(v[0] ?? 0)}
              aria-label="Sivutulo kuukaudessa"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>0 €</span>
              <span>2 000 €</span>
            </div>
          </div>
          <div className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            <div className="mb-1 font-semibold text-foreground">Näin tuki sovitellaan</div>
            Yleistuessa ei ole suojaosaa: jokainen tienattu bruttoeuro pienentää tukea{" "}
            <b className="text-foreground">50 senttiä</b>.
            <br />
            {euro(support)} − 0,5 × {euro(income)} ={" "}
            <b className="text-foreground">{euro(r.adjustedSupport)}</b>
          </div>
        </div>
      </Panel>

      <Panel className="animate-rise">
        <PanelTitle step="2">Tulos</PanelTitle>

        <div className="rounded-2xl bg-hero p-5 text-primary-foreground shadow-raised">
          <Stat
            label="Paljonko jäät oikeasti plussalle"
            value={signedEuro(r.gain)}
            tone="inverse"
            size="xl"
            hint={`kuukaudessa verrattuna tilanteeseen ilman sivutuloa`}
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted p-4">
            <Stat label="Soviteltu tuki" value={euro(r.adjustedSupport)} hint={`−${euro(r.reduction)}`} />
          </div>
          <div className="rounded-xl bg-accent p-4">
            <Stat label="Tulot yhteensä" value={euro(r.total)} tone="success" hint="/ kk brutto" />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div>
            <div className="mb-1.5 flex justify-between text-xs font-semibold text-muted-foreground">
              <span>Ilman sivutuloa</span>
              <span className="text-foreground">{euro(support)}</span>
            </div>
            <div className="h-7 overflow-hidden rounded-lg bg-secondary">
              <div
                className="h-full rounded-lg bg-primary/25 transition-[width] duration-500"
                style={{ width: `${basePct}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-xs font-semibold text-muted-foreground">
              <span>Sivutulon kanssa</span>
              <span className="text-foreground">{euro(r.total)}</span>
            </div>
            <div className="flex h-7 overflow-hidden rounded-lg bg-secondary">
              <div
                className="h-full bg-primary transition-[width] duration-500"
                style={{ width: `${supportPct}%` }}
              />
              <div
                className="h-full bg-success transition-[width] duration-500"
                style={{ width: `${incomePct}%` }}
              />
            </div>
            <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 rounded-sm bg-primary" /> Yleistuki
              </span>
              <span className="flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 rounded-sm bg-success" /> Sivutulo
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <Callout tone="success" icon={<TrendingUp className="h-5 w-5" />}>
            {r.adjustedSupport > 0 ? (
              <>
                Jokaisesta tienatusta eurosta jää käteesi <b>50 senttiä</b> ennen veroja. Työnteko
                kannattaa aina.
              </>
            ) : (
              <>
                Sivutulosi on niin suuri, että yleistukea ei makseta tältä kuulta. Jokainen
                lisäeuro on nyt kokonaan sinun.
              </>
            )}
          </Callout>
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Summat ovat bruttoja ennen veroja. Soviteltu tuki maksetaan jälkikäteen
            palkkatietojen perusteella.
          </p>
        </div>
      </Panel>
    </div>
  );
}
