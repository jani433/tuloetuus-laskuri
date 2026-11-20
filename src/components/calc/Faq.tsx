import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import {
  GENERAL_SUPPORT_DEFAULT_MONTHLY,
  STUDENT_LIMIT_FREE_MONTH,
  STUDENT_LIMIT_SUPPORT_MONTH,
  STUDENT_MARGIN,
  calcGeneralSupport,
  studentAnnualLimit,
} from "@/lib/calc";
import { euro } from "@/lib/format";

const exampleLimit = studentAnnualLimit(9);
const exampleGeneral = calcGeneralSupport(GENERAL_SUPPORT_DEFAULT_MONTHLY, 600);

const FAQ: { q: string; a: ReactNode }[] = [
  {
    q: "Paljonko opiskelija saa tienata vuonna 2026 ilman että opintotuki peritään takaisin?",
    a: (
      <>
        <p>
          Vuosituloraja riippuu tukikuukausista: jokaista tukikuukautta kohden saat tienata{" "}
          {euro(STUDENT_LIMIT_SUPPORT_MONTH)} ja jokaista tuetonta kuukautta kohden{" "}
          {euro(STUDENT_LIMIT_FREE_MONTH)}. Esimerkiksi 9 tukikuukaudella raja on{" "}
          {euro(exampleLimit)}, ja sen päälle tulee {euro(STUDENT_MARGIN)} ylitysvara – yhteensä{" "}
          <b>{euro(exampleLimit + STUDENT_MARGIN)}</b> vuodessa.
        </p>
        <p>
          Jos raja ylittyy, Kela perii tukea takaisin ja lisää siihen 7,5 % korotuksen. Korotuksen
          voi välttää perumalla tukikuukausia tai palauttamalla tukea vapaaehtoisesti OmaKelassa.
        </p>
      </>
    ),
  },
  {
    q: "Miten sivutulot vaikuttavat Kelan yleistukeen vuonna 2026?",
    a: (
      <>
        <p>
          Yleistuessa ei ole suojaosaa, joten jokainen tienattu bruttoeuro pienentää tukea 50
          senttiä. Esimerkiksi {euro(600)} sivutulolla {euro(GENERAL_SUPPORT_DEFAULT_MONTHLY)}{" "}
          tuesta jää {euro(exampleGeneral.adjustedSupport)}, jolloin tulot ovat yhteensä{" "}
          {euro(exampleGeneral.total)} ja jäät <b>{euro(exampleGeneral.gain)} plussalle</b>{" "}
          kuukaudessa.
        </p>
        <p>
          Työnteko kannattaa siis aina. Kela saa palkkatiedot tulorekisteristä, mutta esimerkiksi
          laskutus- ja yritystulot sekä ulkomailta maksetut tulot ilmoitetaan itse.
        </p>
      </>
    ),
  },
  {
    q: "Pitääkö ulkomaisista alustatöistä (esim. AI-koulutus, freelance) ilmoittaa Kelaan ja verottajalle?",
    a: (
      <>
        <p>
          Kyllä. Suomessa asuva maksaa veroa myös ulkomailta saaduista tuloista. Ulkomaisen alustan
          maksamat palkkiot eivät yleensä näy tulorekisterissä, joten ilmoita ne itse
          veroilmoituksella OmaVerossa. Ennakkoveron voi hakea etukäteen, ettei jälkiveroja tule.
        </p>
        <p>
          Myös Kelalle tulot pitää ilmoittaa itse OmaKelassa. Ne lasketaan opintotuen
          vuosituloihin ja voivat pienentää yleistukea tai asumistukea. Säilytä maksutositteet ja
          valuuttamuunnokset.
        </p>
      </>
    ),
  },
];

export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="mt-14">
      <h2 id="faq-title" className="text-xl font-bold text-foreground">
        Usein kysytyt kysymykset (2026)
      </h2>
      <div className="mt-5 space-y-3">
        {FAQ.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border bg-card shadow-card open:border-success/30"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 font-display text-base font-bold leading-snug text-foreground [&::-webkit-details-marker]:hidden">
              <h3 className="font-bold">{item.q}</h3>
              <ChevronDown className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 group-open:text-success" />
            </summary>
            <div className="space-y-3 px-5 pb-5 text-sm leading-relaxed text-muted-foreground [&_b]:text-foreground">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
