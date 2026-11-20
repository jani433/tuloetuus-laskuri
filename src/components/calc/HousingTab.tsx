import { useState } from "react";
import { BellRing, CheckCircle2, Info } from "lucide-react";
import {
  HOUSING_NOTIFY_DECREASE,
  HOUSING_NOTIFY_INCREASE,
  calcHousing,
  housingEstimate,
} from "@/lib/calc";
import { euro, signedEuro } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Callout, CopyLinkButton, NumberField, Panel, PanelTitle, Stat } from "./parts";

const STEPS = [0, 100, 200, 300, 400, 500, 600, 700, 800];

export function HousingTab() {
  const [support, setSupport] = useState(350);
  const [change, setChange] = useState(450);
  const r = calcHousing(support, change);

  const bars = STEPS.map((s) => ({ step: s, value: housingEstimate(support, s).estimate }));
  const maxBar = Math.max(support, 1);
  const activeStep = STEPS.reduce(
    (best, s) => (Math.abs(s - change) < Math.abs(best - change) ? s : best),
    0,
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
      <Panel>
        <PanelTitle step="1">Sinun tilanteesi</PanelTitle>
        <div className="space-y-7">
          <NumberField label="Nykyinen asumistuki / kk" value={support} onChange={setSupport} />
          <NumberField
            label="Kuukausitulojen muutos"
            value={change}
            onChange={setChange}
            allowNegative
            suffix="€/kk"
            hint="Kirjoita tulojen lasku miinusmerkillä, esim. −250."
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-dashed border-border p-4">
              <div className="figure text-2xl text-foreground">+{HOUSING_NOTIFY_INCREASE} €</div>
              <div className="mt-1.5 text-xs text-muted-foreground">
                tulojen nousu / kk → ilmoita Kelaan
              </div>
            </div>
            <div className="rounded-xl border border-dashed border-border p-4">
              <div className="figure text-2xl text-foreground">−{HOUSING_NOTIFY_DECREASE} €</div>
              <div className="mt-1.5 text-xs text-muted-foreground">
                tulojen lasku / kk → ilmoita Kelaan
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="animate-rise">
        <PanelTitle step="2">Suuntaa-antava vaikutus</PanelTitle>

        <div className="grid grid-cols-2 gap-4">
          <Stat
            label="Arvioitu asumistuki"
            value={euro(r.estimatedSupport)}
            size="lg"
            hint="/ kk"
          />
          <Stat
            label="Muutos"
            value={signedEuro(r.difference)}
            tone={r.difference < 0 ? "danger" : r.difference > 0 ? "success" : "default"}
            size="lg"
            hint="/ kk"
          />
        </div>

        <div className="mt-5">
          {r.mustNotify ? (
            <Callout
              tone="warning"
              icon={<BellRing className="h-5 w-5" />}
              title="Muista ilmoittaa muutoksesta Kelaan"
            >
              {r.notifyReason === "increase"
                ? `Tulosi nousevat vähintään ${HOUSING_NOTIFY_INCREASE} €/kk edelliseen päätökseen verrattuna. Ilmoita muutoksesta OmaKelassa, jotta vältät liikaa maksetun tuen takaisinperinnän.`
                : `Tulosi laskevat vähintään ${HOUSING_NOTIFY_DECREASE} €/kk edelliseen päätökseen verrattuna. Ilmoita muutoksesta OmaKelassa – voit saada enemmän asumistukea.`}
            </Callout>
          ) : (
            <Callout tone="success" icon={<CheckCircle2 className="h-5 w-5" />}>
              Muutos jää ilmoitusrajojen sisälle (nousu alle {HOUSING_NOTIFY_INCREASE} €/kk, lasku
              alle {HOUSING_NOTIFY_DECREASE} €/kk). Kela tarkistaa tuen viimeistään vuositarkistuksessa.
            </Callout>
          )}
        </div>

        <div className="mt-6">
          <div className="mb-3 text-sm font-semibold text-foreground">
            Näin tulojen nousu pienentää tukea portaittain
          </div>
          <div className="flex h-40 items-end gap-1.5" role="img" aria-label="Asumistuki tulojen noustessa">
            {bars.map((b) => (
              <div key={b.step} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span
                  className={cn(
                    "text-[10px] font-semibold tabular-nums",
                    b.step === activeStep && change >= 0 ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {b.value}
                </span>
                <div
                  className={cn(
                    "w-full rounded-t-md transition-[height] duration-500",
                    b.step === activeStep && change >= 0
                      ? "bg-primary"
                      : b.step >= HOUSING_NOTIFY_INCREASE
                        ? "bg-warning/50"
                        : "bg-success/45",
                  )}
                  style={{ height: `${(b.value / maxBar) * 100}%`, minHeight: 3 }}
                />
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex gap-1.5">
            {bars.map((b) => (
              <span key={b.step} className="flex-1 text-center text-[10px] text-muted-foreground">
                +{b.step}
              </span>
            ))}
          </div>
          <div className="mt-1 text-center text-xs text-muted-foreground">
            tulojen nousu €/kk · tuki €/kk
          </div>
        </div>

        <p className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Havainnollistus: asumistuki pienenee noin 29 senttiä jokaista lisäeuroa kohden, 50 €:n
          portain. Todellinen määrä riippuu asumismenoista, kotitalouden koosta ja kunnasta.
        </p>

        <CopyLinkButton />
      </Panel>
    </div>
  );
}
