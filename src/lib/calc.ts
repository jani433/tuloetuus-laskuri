// Kelan 2026 julkiset laskentaperusteet. Lähteet ja rajaukset: audit-2026.md.
import { MAX_MONEY, type NumericInput } from "./input";
export const STUDENT_LIMIT_SUPPORT_MONTH = 1118;
export const STUDENT_LIMIT_FREE_MONTH = 3355;
export const STUDENT_MARGIN = 374;
export const STUDENT_RECOVERY_SURCHARGE = 0.075;
export const STUDENT_RECOVERY_BANDS = [
  2237,
  4474,
  6711,
  8948,
  11185,
  13422,
  15659,
  17896,
  20133,
  22370,
  24607,
  Infinity,
];
export const GENERAL_SUPPORT_DAILY = 37.21;
export const GENERAL_SUPPORT_DEFAULT_MONTHLY = 800.02;
export const GENERAL_SUPPORT_REDUCTION = 0.5;
export const GENERAL_MEANS_LIMIT = 311;
export const HOUSING_NOTIFY_INCREASE = 400;
export const HOUSING_NOTIFY_DECREASE = 200;
const cents = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const money = (n: NumericInput): n is number =>
  typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= MAX_MONEY;
const count = (n: NumericInput, min: number, max: number): n is number =>
  money(n) && Number.isInteger(n) && n >= min && n <= max;
export const MONTHS_FI = [
  "tammikuu",
  "helmikuu",
  "maaliskuu",
  "huhtikuu",
  "toukokuu",
  "kesäkuu",
  "heinäkuu",
  "elokuu",
  "syyskuu",
  "lokakuu",
  "marraskuu",
  "joulukuu",
];

export function studentAnnualLimit(supportMonths: number) {
  if (!count(supportMonths, 0, 12)) return NaN;
  return (
    supportMonths * STUDENT_LIMIT_SUPPORT_MONTH + (12 - supportMonths) * STUDENT_LIMIT_FREE_MONTH
  );
}
export function studentRecoveryMonths(excess: number, paidMonths: number) {
  if (!Number.isFinite(excess) || !count(paidMonths, 0, 12)) return NaN;
  if (excess <= STUDENT_MARGIN || paidMonths === 0) return 0;
  const band = STUDENT_RECOVERY_BANDS.findIndex((upper) => Math.round(excess * 100) <= upper * 100);
  return Math.min(paidMonths, band + 1);
}
export interface StudentResult {
  limit: number;
  limitWithMargin: number;
  remaining: number;
  usage: number;
  overLimit: boolean;
  overage: number;
  exceedMonth: number | null;
  safeMonthly: number;
  remainingMonths: number;
  recommendedMonthly: number;
  recoveredMonths: number;
}
export function calcStudent(
  supportMonths: number,
  annualIncome: number,
  currentMonth = 1,
): StudentResult {
  if (!count(supportMonths, 0, 12) || !money(annualIncome) || !count(currentMonth, 1, 12))
    throw new RangeError("Virheelliset opintotuen laskenta-arvot.");
  const limit = studentAnnualLimit(supportMonths);
  const limitWithMargin = limit + STUDENT_MARGIN;
  const remaining = cents(limitWithMargin - annualIncome);
  const overLimit = supportMonths > 0 && annualIncome > limitWithMargin;
  const overage = Math.max(0, cents(annualIncome - limit));
  const remainingMonths = 13 - currentMonth;
  return {
    limit,
    limitWithMargin,
    remaining,
    usage: annualIncome / limitWithMargin,
    overLimit,
    overage,
    exceedMonth: null,
    safeMonthly: limitWithMargin / 12,
    remainingMonths,
    recommendedMonthly: Math.max(0, remaining / remainingMonths),
    recoveredMonths: studentRecoveryMonths(overage, supportMonths),
  };
}
export interface StudentInput {
  months: NumericInput;
  studyMonths: NumericInput;
  earned: NumericInput;
  future: NumericInput;
  studyIncome: NumericInput;
  partialYear: boolean;
  currentMonth: number;
}
export function calcStudentAssessment(input: StudentInput) {
  const { months, studyMonths, earned, future, studyIncome, currentMonth, partialYear } = input;
  if (
    !count(months, 0, 12) ||
    !count(studyMonths, 0, 12) ||
    months > studyMonths ||
    !count(currentMonth, 1, 12) ||
    !money(earned) ||
    !money(future) ||
    (partialYear && (!money(studyIncome) || studyIncome > earned + future))
  )
    return null;
  const annualIncome = cents(earned + future);
  const base = calcStudent(months, annualIncome, currentMonth);
  const studyLimit = months * 1118 + (studyMonths - months) * 3355 + 374;
  const exceptionFits = partialYear && studyIncome !== null && studyIncome <= studyLimit;
  const noAid = months === 0;
  // The public annual recovery table does not specify recovery after a failed study-period exception.
  const uncertainRecovery = partialYear && base.overLimit && !exceptionFits;
  return {
    ...base,
    annualIncome,
    roomBeforeForecast: cents(base.limitWithMargin - earned),
    studyLimit,
    exceptionFits,
    noAid,
    uncertainRecovery,
    overLimit: !noAid && base.overLimit && !exceptionFits,
    recoveredMonths: noAid || exceptionFits ? 0 : uncertainRecovery ? null : base.recoveredMonths,
    recommendedMonthly: noAid
      ? null
      : partialYear
        ? null
        : Math.max(0, (base.limitWithMargin - earned) / base.remainingMonths),
    voluntaryMonths:
      noAid || exceptionFits
        ? 0
        : uncertainRecovery
          ? null
          : Math.min(months, Math.max(0, Math.ceil((annualIncome - base.limitWithMargin) / 2237))),
  };
}
export interface GeneralInput {
  support: NumericInput;
  wages: NumericInput;
  capital: NumericInput;
  rent: NumericInput;
  other: NumericInput;
  benefits: NumericInput;
  special?: boolean;
  employmentService?: boolean;
}
export interface GeneralSupportResult {
  adjustedSupport: number;
  reduction: number;
  total: number;
  gain: number;
  baseline: number;
  keptPerEuro: number;
  wageReduction: number;
  meansReduction: number;
  benefitReduction: number;
  meansIncome: number;
  usedLimit: number;
}
export function calcGeneralSupport(fullSupport: number, grossIncome: number): GeneralSupportResult;
export function calcGeneralSupport(input: GeneralInput): GeneralSupportResult | null;
export function calcGeneralSupport(
  input: number | GeneralInput,
  grossIncome = 0,
): GeneralSupportResult | null {
  const i: GeneralInput =
    typeof input === "number"
      ? { support: input, wages: grossIncome, capital: 0, rent: 0, other: 0, benefits: 0 }
      : input;
  const { support, wages, capital, rent, other, benefits } = i;
  if (
    !money(support) ||
    support > GENERAL_SUPPORT_DEFAULT_MONTHLY ||
    !money(wages) ||
    !money(capital) ||
    !money(rent) ||
    !money(other) ||
    !money(benefits) ||
    i.special
  )
    return null;
  const meansIncome = cents(capital + rent + other);
  const wageReduction = cents(0.5 * wages);
  const meansReduction = i.employmentService
    ? 0
    : cents(0.5 * Math.max(0, meansIncome - GENERAL_MEANS_LIMIT));
  const benefitReduction = benefits;
  const adjustedSupport = cents(
    Math.max(0, support - wageReduction - meansReduction - benefitReduction),
  );
  const reduction = cents(support - adjustedSupport);
  const total = cents(wages + meansIncome + benefits + adjustedSupport);
  // Compare with the same deductible other benefits, not with an unrelated full payment.
  const baseline = Math.max(0, support - benefits) + benefits;
  const gain = cents(total - baseline);
  return {
    adjustedSupport,
    reduction,
    total,
    gain,
    baseline: cents(baseline),
    keptPerEuro: wages > 0 ? gain / wages : 0.5,
    wageReduction,
    meansReduction,
    benefitReduction,
    meansIncome,
    usedLimit: GENERAL_MEANS_LIMIT,
  };
}
export const HOUSING_GROUPS = {
  capital: {
    label: "Espoo, Helsinki, Kauniainen, Vantaa",
    limits: [563, 808, 1019, 1188],
    extra: 148,
  },
  large: {
    label:
      "Hyvinkää, Hämeenlinna, Joensuu, Jyväskylä, Järvenpää, Kerava, Kirkkonummi, Kuopio, Lahti, Lohja, Nokia, Nurmijärvi, Oulu, Porvoo, Raisio, Riihimäki, Rovaniemi, Seinäjoki, Sipoo, Siuntio, Tampere, Turku, Tuusula, Vihti",
    limits: [447, 652, 828, 981],
    extra: 134,
  },
  other: { label: "Muut Manner-Suomen kunnat", limits: [394, 574, 734, 875], extra: 129 },
  aland: { label: "Ahvenanmaan kunnat", limits: [470, 687, 871, 1032], extra: 141 },
};
export type HousingGroup = keyof typeof HOUSING_GROUPS;
export function housingExpenseLimit(people: number, group: HousingGroup) {
  if (!count(people, 1, 41) || !Object.hasOwn(HOUSING_GROUPS, group)) return NaN;
  const row = HOUSING_GROUPS[group];
  return (row.limits[Math.min(people, 4) - 1] ?? 0) + Math.max(0, people - 4) * row.extra;
}
export function housingNotification(change: number) {
  const notifyReason = change >= 400 ? "increase" : change <= -200 ? "decrease" : null;
  return { mustNotify: notifyReason !== null, notifyReason };
}
export interface HousingInput {
  adults: NumericInput;
  children: NumericInput;
  income: NumericInput;
  previousIncome: NumericInput;
  currentSupport: NumericInput;
  rent: NumericInput;
  water: NumericInput;
  heating: NumericInput;
  assets: NumericInput;
  debts: NumericInput;
  savings: NumericInput;
  group: string;
  heatingRegion?: string;
  extraSpace?: boolean;
  special?: boolean;
}
export function calcHousing(input: HousingInput) {
  const {
    adults,
    children,
    income,
    previousIncome,
    currentSupport,
    rent,
    water,
    heating,
    assets,
    debts,
    savings,
    group,
  } = input;
  if (
    !count(adults, 1, 20) ||
    !count(children, 0, 20) ||
    ![income, previousIncome, currentSupport, rent, water, heating, assets, debts, savings].every(
      money,
    ) ||
    !Object.hasOwn(HOUSING_GROUPS, group) ||
    input.special
  )
    return null;
  // Explicit narrowing rather than assuming the array predicate narrows individual variables.
  if (
    income === null ||
    previousIncome === null ||
    currentSupport === null ||
    rent === null ||
    water === null ||
    heating === null ||
    assets === null ||
    debts === null ||
    savings === null
  )
    return null;
  const people = adults + children;
  const ceiling = housingExpenseLimit(people + (input.extraSpace ? 1 : 0), group as HousingGroup);
  const heatingMax =
    input.heatingRegion === "north"
      ? 50 + 17 * (people - 1)
      : input.heatingRegion === "east"
        ? 48 + 17 * (people - 1)
        : 46 + 16 * (people - 1);
  const acceptedWater = Math.min(water, people * 20);
  const acceptedHeating = Math.min(heating, heatingMax);
  const housingCosts = cents(rent + acceptedWater + acceptedHeating);
  const acceptedCosts = Math.min(housingCosts, ceiling);
  // savings is deposits AFTER each person's 2,000 € deposit disregard; assets is other countable property.
  const netAssets = Math.max(0, assets + savings - debts);
  const assetThreshold = adults === 1 ? 10000 : 20000;
  const assetIncome = (Math.max(0, netAssets - assetThreshold) * 0.2) / 12;
  const totalIncome = income + assetIncome;
  const aland = group === "aland";
  const deductible = Math.max(
    0,
    (aland ? 0.42 : 0.5) *
      (totalIncome - (667 + (aland ? 111 : 94) * adults + (aland ? 246 : 296) * children)),
  );
  const raw = Math.max(0, (aland ? 0.8 : 0.7) * (acceptedCosts - deductible));
  const assetExcluded = netAssets >= 50000;
  const estimatedSupport = assetExcluded || raw < 15 ? 0 : cents(raw);
  const change = cents(income - previousIncome);
  return {
    estimatedSupport,
    difference: cents(estimatedSupport - currentSupport),
    deductible: cents(deductible),
    acceptedCosts,
    housingCosts,
    ceiling,
    acceptedWater,
    acceptedHeating,
    assetIncome: cents(assetIncome),
    netAssets,
    totalIncome: cents(totalIncome),
    assetExcluded,
    belowMinimum: !assetExcluded && raw > 0 && raw < 15,
    change,
    ...housingNotification(change),
  };
}
export function housingEstimate(input: HousingInput, incomeChange: number) {
  if (input.income === null || !Number.isFinite(incomeChange)) return null;
  return calcHousing({ ...input, income: Math.max(0, input.income + incomeChange) });
}
