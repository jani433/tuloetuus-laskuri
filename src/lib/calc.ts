// Kelan 2026 säännöt (suuntaa-antava). Kaikki laskenta tapahtuu selaimessa.

export const STUDENT_LIMIT_SUPPORT_MONTH = 1118;
export const STUDENT_LIMIT_FREE_MONTH = 3355;
export const STUDENT_MARGIN = 374;
export const STUDENT_RECOVERY_SURCHARGE = 0.075;

export const GENERAL_SUPPORT_DAILY = 37.21;
export const GENERAL_SUPPORT_DEFAULT_MONTHLY = 800;
export const GENERAL_SUPPORT_REDUCTION = 0.5;

export const HOUSING_NOTIFY_INCREASE = 400;
export const HOUSING_NOTIFY_DECREASE = 200;
/** Arvio: perusomavastuu 42 % tuloista × tuen osuus 70 % ≈ 0,294 €/€. */
export const HOUSING_REDUCTION_RATE = 0.42 * 0.7;
/** Tulomuutos lasketaan 50 € portain havainnollistusta varten. */
export const HOUSING_STEP = 50;

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
  const m = Math.min(12, Math.max(0, Math.round(supportMonths)));
  return m * STUDENT_LIMIT_SUPPORT_MONTH + (12 - m) * STUDENT_LIMIT_FREE_MONTH;
}

export interface StudentResult {
  limit: number;
  limitWithMargin: number;
  remaining: number;
  usage: number;
  overLimit: boolean;
  overage: number;
  /** 1–12: kuukausi jona raja ylittyy, jos tulot kertyvät tasaisesti. null = ei ylity. */
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
  const income = Math.max(0, annualIncome);
  const limit = studentAnnualLimit(supportMonths);
  const limitWithMargin = limit + STUDENT_MARGIN;
  const remaining = limitWithMargin - income;
  const overLimit = income > limitWithMargin;
  const overage = Math.max(0, income - limit);

  const monthly = income / 12;
  let exceedMonth: number | null = null;
  if (overLimit && monthly > 0) {
    exceedMonth = Math.min(12, Math.floor(limitWithMargin / monthly) + 1);
  }

  const cm = Math.min(12, Math.max(1, Math.round(currentMonth)));
  const elapsed = cm - 1;
  const remainingMonths = 12 - elapsed;
  const earnedSoFar = (income * elapsed) / 12;
  const recommendedMonthly = Math.max(0, (limitWithMargin - earnedSoFar) / remainingMonths);

  const recoveredMonths = overLimit
    ? Math.min(Math.max(1, supportMonths), Math.ceil(overage / STUDENT_LIMIT_SUPPORT_MONTH))
    : 0;

  return {
    limit,
    limitWithMargin,
    remaining,
    usage: limitWithMargin > 0 ? income / limitWithMargin : 0,
    overLimit,
    overage,
    exceedMonth,
    safeMonthly: limitWithMargin / 12,
    remainingMonths,
    recommendedMonthly,
    recoveredMonths,
  };
}

export interface GeneralSupportResult {
  adjustedSupport: number;
  reduction: number;
  total: number;
  gain: number;
  keptPerEuro: number;
}

export function calcGeneralSupport(fullSupport: number, grossIncome: number): GeneralSupportResult {
  const support = Math.max(0, fullSupport);
  const income = Math.max(0, grossIncome);
  const adjustedSupport = Math.max(0, support - GENERAL_SUPPORT_REDUCTION * income);
  const reduction = support - adjustedSupport;
  const total = income + adjustedSupport;
  const gain = total - support;
  return {
    adjustedSupport,
    reduction,
    total,
    gain,
    keptPerEuro: income > 0 ? gain / income : 1 - GENERAL_SUPPORT_REDUCTION,
  };
}

export interface HousingResult {
  steppedChange: number;
  estimatedSupport: number;
  difference: number;
  mustNotify: boolean;
  notifyReason: "increase" | "decrease" | null;
}

export function housingEstimate(currentSupport: number, incomeChange: number) {
  const support = Math.max(0, currentSupport);
  const stepped = Math.trunc(incomeChange / HOUSING_STEP) * HOUSING_STEP;
  const raw = support - stepped * HOUSING_REDUCTION_RATE;
  return { stepped, estimate: Math.max(0, Math.round(raw)) };
}

export function calcHousing(currentSupport: number, incomeChange: number): HousingResult {
  const { stepped, estimate } = housingEstimate(currentSupport, incomeChange);
  const notifyReason =
    incomeChange >= HOUSING_NOTIFY_INCREASE
      ? "increase"
      : incomeChange <= -HOUSING_NOTIFY_DECREASE
        ? "decrease"
        : null;
  return {
    steppedChange: stepped,
    estimatedSupport: estimate,
    difference: estimate - Math.max(0, currentSupport),
    mustNotify: notifyReason !== null,
    notifyReason,
  };
}
