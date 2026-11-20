import { describe, expect, it } from "vitest";
import {
  calcGeneralSupport,
  calcHousing,
  calcStudent,
  studentAnnualLimit,
  housingNotification,
  calcStudentAssessment,
  studentRecoveryMonths,
  housingExpenseLimit,
  housingEstimate,
} from "@/lib/calc";

describe("Opintotuki 2026", () => {
  it("julkinen perusfunktio torjuu virheelliset arvot", () => {
    expect(() => calcStudent(13, 1000)).toThrow(RangeError);
    expect(() => calcStudent(9, NaN)).toThrow(RangeError);
    expect(() => calcStudent(9, 1000, 0)).toThrow(RangeError);
  });
  it("vuosituloraja 9 tukikuukaudella = 9×1118 + 3×3355", () => {
    expect(studentAnnualLimit(9)).toBe(9 * 1118 + 3 * 3355);
  });
  it("ylitysvara 374 € lisätään rajan päälle", () => {
    expect(calcStudent(12, 0).limitWithMargin).toBe(12 * 1118 + 374);
  });
  it("raja ei ylity, jos tulot ovat tasan raja + ylitysvara", () => {
    const r = calcStudent(9, studentAnnualLimit(9) + 374);
    expect(r.overLimit).toBe(false);
  });
  it("raja ylittyy, kun tulot ylittävät rajan + ylitysvaran", () => {
    const r = calcStudent(9, studentAnnualLimit(9) + 375);
    expect(r.overLimit).toBe(true);
  });
});

describe("Yleistuki 2026", () => {
  it("jokainen bruttoeuro vähentää tukea 50 senttiä", () => {
    expect(calcGeneralSupport(800, 400).adjustedSupport).toBe(600);
  });
  it("soviteltu tuki ei mene alle nollan", () => {
    expect(calcGeneralSupport(800, 2000).adjustedSupport).toBe(0);
  });
  it("plussalle jää sivutulo miinus tuen vähennys", () => {
    expect(calcGeneralSupport(800, 400).gain).toBe(200);
  });
});

describe("Asumistuki – ilmoitusvelvollisuus", () => {
  it("nousu 400 €/kk vaatii ilmoituksen", () => {
    expect(housingNotification(400).mustNotify).toBe(true);
  });
  it("nousu 399 €/kk ei vaadi ilmoitusta", () => {
    expect(housingNotification(399).mustNotify).toBe(false);
  });
  it("lasku 200 €/kk vaatii ilmoituksen", () => {
    expect(housingNotification(-200).mustNotify).toBe(true);
  });
  it("lasku 199 €/kk ei vaadi ilmoitusta", () => {
    expect(housingNotification(-199).mustNotify).toBe(false);
  });
});

const student = {
  months: 9,
  studyMonths: 12,
  earned: 10000,
  future: 2000,
  studyIncome: 12000,
  partialYear: false,
  currentMonth: 11,
};
const general = { support: 800.02, wages: 0, capital: 0, rent: 0, other: 0, benefits: 0 };
const housing = {
  adults: 1,
  children: 0,
  income: 0,
  previousIncome: 0,
  currentSupport: 0,
  rent: 1000,
  water: 0,
  heating: 0,
  assets: 0,
  savings: 0,
  debts: 0,
  group: "capital",
};
describe("Opintotuen korjattu tulovalvonta", () => {
  it("erottaa 10 501 euron tulotilan ennen ennustetta ja 8 501 euroa sen jälkeen", () => {
    const r = calcStudentAssessment(student);
    expect(r?.limitWithMargin).toBe(20501);
    expect(r?.annualIncome).toBe(12000);
    expect(r?.roomBeforeForecast).toBe(10501);
    expect(r?.remaining).toBe(8501);
    expect(r?.recommendedMonthly).toBe(5250.5);
  });
  it("ennuste vähennetään kerran eikä muuta toteutuneisiin tuloihin perustuvaa kuukausisuositusta", () => {
    const r = calcStudentAssessment({ ...student, future: 5000 });
    expect(r?.roomBeforeForecast).toBe(10501);
    expect(r?.remaining).toBe(5501);
    expect(r?.recommendedMonthly).toBe(5250.5);
  });
  it.each(Array.from({ length: 13 }, (_, i) => i))(
    "%i tukikuukauden tuloraja ja enimmäisperintä",
    (m) => {
      expect(studentAnnualLimit(m)).toBe(m * 1118 + (12 - m) * 3355);
      expect(
        calcStudentAssessment({ ...student, months: m, earned: 100000, future: 0 })
          ?.recoveredMonths,
      ).toBe(m);
    },
  );
  it("374 euron ylitys sallitaan, 374,01 ei", () => {
    expect(studentRecoveryMonths(374, 12)).toBe(0);
    expect(studentRecoveryMonths(374.01, 12)).toBe(1);
  });
  it.each(Array.from({ length: 11 }, (_, i) => i + 1))(
    "takaisinperinnän %i. taulukkoraja sentin tarkkuudella",
    (n) => {
      expect(studentRecoveryMonths(n * 2237, 12)).toBe(n);
      expect(studentRecoveryMonths(n * 2237 + 0.01, 12)).toBe(n + 1);
    },
  );
  it("ei tasaisen tulokertymän oletusta", () => {
    const r = calcStudentAssessment({ ...student, earned: 20000, future: 2000 });
    expect(r?.recommendedMonthly).toBe(250.5);
    expect(r?.annualIncome).toBe(22000);
    expect(r?.exceedMonth).toBeNull();
  });
  it("nolla tukikuukautta ei tuota takaisinperintää", () => {
    expect(calcStudentAssessment({ ...student, months: 0, earned: 100000 })?.noAid).toBe(true);
    expect(calcStudentAssessment({ ...student, months: 0, earned: 100000 })?.recoveredMonths).toBe(
      0,
    );
  });
  it("aloitus-/valmistumisvuoden hyväksyttävä opiskeluajan poikkeus", () => {
    const r = calcStudentAssessment({
      ...student,
      months: 4,
      studyMonths: 4,
      earned: 50000,
      partialYear: true,
      studyIncome: 4846,
    });
    expect(r?.exceptionFits).toBe(true);
    expect(r?.recoveredMonths).toBe(0);
    expect(
      calcStudentAssessment({
        ...student,
        months: 4,
        studyMonths: 4,
        earned: 50000,
        partialYear: true,
        studyIncome: 4846.01,
      })?.recoveredMonths,
    ).toBeNull();
  });
  it("puuttuvat ja virheelliset tiedot estävät laskennan", () => {
    expect(calcStudentAssessment({ ...student, earned: null })).toBeNull();
    expect(calcStudentAssessment({ ...student, months: 13 })).toBeNull();
    expect(calcStudentAssessment({ ...student, months: 9, studyMonths: 8 })).toBeNull();
    expect(calcStudentAssessment({ ...student, earned: NaN })).toBeNull();
  });
});
describe("Yleistuen tulolajit", () => {
  it("kuvaajan vertailutulo sisältää ennallaan pidetyt etuudet myös niiden ylittäessä täyden tuen", () => {
    const r = calcGeneralSupport({ ...general, benefits: 1000, wages: 400 });
    expect(r?.baseline).toBe(1000);
    expect(r?.total).toBe(1400);
    expect(r?.gain).toBe(400);
  });
  it("ei tuloja: täysi keskimääräinen kuukausituki", () =>
    expect(calcGeneralSupport(general)?.adjustedSupport).toBe(800.02));
  it("palkka sovitellaan ilman 311 euron suojaa", () =>
    expect(calcGeneralSupport({ ...general, wages: 311 })?.adjustedSupport).toBe(644.52));
  it.each(["capital", "rent", "other"] as const)(
    "%s käyttää 311 euron tarveharkintarajaa",
    (key) => {
      expect(calcGeneralSupport({ ...general, [key]: 310.99 })?.adjustedSupport).toBe(800.02);
      expect(calcGeneralSupport({ ...general, [key]: 311 })?.adjustedSupport).toBe(800.02);
      expect(calcGeneralSupport({ ...general, [key]: 411 })?.adjustedSupport).toBe(750.02);
    },
  );
  it("tulolajit summataan mutta palkka erotellaan", () => {
    const r = calcGeneralSupport({
      ...general,
      wages: 400,
      capital: 200,
      rent: 211,
      other: 100,
      benefits: 50,
    });
    expect(r?.meansReduction).toBe(100);
    expect(r?.wageReduction).toBe(200);
    expect(r?.benefitReduction).toBe(50);
    expect(r?.adjustedSupport).toBe(450.02);
  });
  it("tuki ei voi mennä alle nollan eikä ylittää täyttä määrää", () => {
    expect(calcGeneralSupport({ ...general, wages: 100000 })?.adjustedSupport).toBe(0);
    expect(calcGeneralSupport({ ...general, support: 900 })).toBeNull();
    expect(calcGeneralSupport({ ...general, wages: -1 })).toBeNull();
    expect(calcGeneralSupport({ ...general, capital: null })).toBeNull();
  });
  it("erityistilanne ei saa keksittyä tulosta", () =>
    expect(calcGeneralSupport({ ...general, special: true })).toBeNull());
  it("työllistymistä edistävän palvelun tarveharkintapoikkeus", () =>
    expect(
      calcGeneralSupport({ ...general, capital: 1000, employmentService: true })?.meansReduction,
    ).toBe(0));
});
describe("Asumistuen kaava 2026", () => {
  it("Kelan Pekan 15 000 euron sijoituksesta tulee 83,33 euron kuukausitulo", () => {
    expect(calcHousing({ ...housing, assets: 15000 })?.assetIncome).toBe(83.33);
  });
  it("Kelan Maijan Helsingin 800 euron vuokrasta hyväksytään 563 euroa", () => {
    expect(calcHousing({ ...housing, rent: 800 })?.acceptedCosts).toBe(563);
  });
  it("Kelan Tommin ja Pauliinan Turun 750 euron vuokrasta hyväksytään 652 euroa", () => {
    expect(calcHousing({ ...housing, adults: 2, rent: 750, group: "large" })?.acceptedCosts).toBe(
      652,
    );
  });
  it("vastaa Kelan Turun kahden aikuisen 1 800 euron esimerkkiä", () => {
    const r = calcHousing({ ...housing, adults: 2, income: 1800, rent: 950, group: "large" });
    expect(r?.acceptedCosts).toBe(652);
    expect(r?.deductible).toBe(472.5);
    expect(r?.estimatedSupport).toBe(125.65);
  });
  it.each([
    [1, 563],
    [2, 808],
    [3, 1019],
    [4, 1188],
    [5, 1336],
  ])("%i henkilön pääkaupunkiseudun enimmäismenot", (people, expected) =>
    expect(housingExpenseLimit(people, "capital")).toBe(expected),
  );
  it("eri kuntaryhmien rajat", () => {
    expect(housingExpenseLimit(1, "large")).toBe(447);
    expect(housingExpenseLimit(1, "other")).toBe(394);
    expect(housingExpenseLimit(1, "aland")).toBe(470);
  });
  it("yksin asuvan pienillä tuloilla 70 % menokatosta", () =>
    expect(calcHousing(housing)?.estimatedSupport).toBe(394.1));
  it("kahden aikuisen omavastuu ja tuki", () => {
    const r = calcHousing({ ...housing, adults: 2, income: 1000 });
    expect(r?.deductible).toBe(72.5);
    expect(r?.estimatedSupport).toBe(514.85);
  });
  it("aikuiset ja lapset vaikuttavat omavastuuseen eri tavalla", () =>
    expect(calcHousing({ ...housing, adults: 2, children: 2, income: 2000 })?.deductible).toBe(
      276.5,
    ));
  it("suuret tulot lopettavat tuen", () =>
    expect(calcHousing({ ...housing, income: 100000 })?.estimatedSupport).toBe(0));
  it("tulojen nousu ja lasku lasketaan samalla kaavalla", () => {
    const input = { ...housing, income: 1000 };
    expect(housingEstimate(input, 200)?.estimatedSupport).toBe(240.45);
    expect(housingEstimate(input, -200)?.estimatedSupport).toBe(380.45);
    expect(housingEstimate(input, -2000)?.estimatedSupport).toBe(394.1);
  });
  it("vesi- ja lämmitysrajat sekä todellinen vuokra", () => {
    const r = calcHousing({ ...housing, rent: 200, water: 50, heating: 100 });
    expect(r?.acceptedWater).toBe(20);
    expect(r?.acceptedHeating).toBe(46);
    expect(r?.acceptedCosts).toBe(266);
    expect(r?.estimatedSupport).toBe(186.2);
    expect(
      calcHousing({ ...housing, adults: 2, heating: 100, heatingRegion: "north" })?.acceptedHeating,
    ).toBe(67);
    expect(calcHousing({ ...housing, heating: 100, heatingRegion: "east" })?.acceptedHeating).toBe(
      48,
    );
  });
  it("varallisuuden 10000/20000 euron rajat ja 20 % vuosituotto", () => {
    expect(calcHousing({ ...housing, assets: 15000 })?.assetIncome).toBe(83.33);
    expect(calcHousing({ ...housing, adults: 2, assets: 20000 })?.assetIncome).toBe(0);
    expect(calcHousing({ ...housing, assets: 50000 })?.estimatedSupport).toBe(0);
    expect(calcHousing({ ...housing, assets: 50000, debts: 1 })?.assetExcluded).toBe(false);
  });
  it("talletuksia ei vähennetä uudelleen", () =>
    expect(calcHousing({ ...housing, assets: 9000, savings: 2000, debts: 500 })?.netAssets).toBe(
      10500,
    ));
  it("15 euroa on maksettava, sitä pienempi ei", () => {
    expect(calcHousing({ ...housing, rent: 100, income: 918.16 })?.estimatedSupport).toBe(0);
    expect(calcHousing({ ...housing, rent: 100, income: 918.14 })?.estimatedSupport).toBe(15);
  });
  it("Ahvenanmaan eri kaava", () => {
    const r = calcHousing({ ...housing, group: "aland", income: 1000 });
    expect(r?.deductible).toBe(93.24);
    expect(r?.estimatedSupport).toBe(301.41);
  });
  it("hyväksytty lisätilan tarve nostaa kattoa mutta ei muuta henkilömäärää", () => {
    expect(calcHousing({ ...housing, extraSpace: true })?.ceiling).toBe(808);
    expect(calcHousing({ ...housing, extraSpace: true, income: 1000 })?.deductible).toBe(119.5);
  });
  it("puuttuvat tiedot ja tuntematon kunta estävät laskennan", () => {
    expect(calcHousing({ ...housing, income: null })).toBeNull();
    expect(calcHousing({ ...housing, group: "unknown" })).toBeNull();
    expect(calcHousing({ ...housing, adults: 0 })).toBeNull();
    expect(calcHousing({ ...housing, special: true })).toBeNull();
  });
});
