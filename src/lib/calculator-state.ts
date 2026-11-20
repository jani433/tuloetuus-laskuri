import { MAX_MONEY, type NumericInput } from "./input";

export const MUNICIPAL_GROUPS = ["capital", "large", "other", "aland"] as const;
export type CalculatorTab = "student" | "jobseeker" | "housing";
export type IncomeType = "none" | "wage" | "capital" | "rent" | "other" | "mixed";
export interface CalculatorState {
  version: 1;
  tab: CalculatorTab;
  student: {
    months: NumericInput;
    studyMonths: NumericInput;
    earned: NumericInput;
    future: NumericInput;
    studyIncome: NumericInput;
    partialYear: boolean;
    currentMonth: number;
  };
  general: {
    support: NumericInput;
    wages: NumericInput;
    capital: NumericInput;
    rent: NumericInput;
    other: NumericInput;
    benefits: NumericInput;
    type: IncomeType;
    special: boolean;
  };
  housing: {
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
    heatingRegion: string;
    extraSpace: boolean;
    special: boolean;
  };
}
export const DEFAULT_STATE: CalculatorState = {
  version: 1,
  tab: "student",
  student: {
    months: 9,
    studyMonths: 12,
    earned: 10000,
    future: 2000,
    studyIncome: 12000,
    partialYear: false,
    currentMonth: 1,
  },
  general: {
    support: 800.02,
    wages: 600,
    capital: 0,
    rent: 0,
    other: 0,
    benefits: 0,
    type: "wage",
    special: false,
  },
  housing: {
    adults: 1,
    children: 0,
    income: 1000,
    previousIncome: 550,
    currentSupport: 350,
    rent: 650,
    water: 20,
    heating: 0,
    assets: 0,
    debts: 0,
    savings: 0,
    group: "large",
    heatingRegion: "normal",
    extraSpace: false,
    special: false,
  },
};
const numericRules: Record<string, [number, number, boolean]> = {
  months: [0, 12, true],
  studyMonths: [0, 12, true],
  currentMonth: [1, 12, true],
  adults: [1, 20, true],
  children: [0, 20, true],
  support: [0, 800.02, false],
};
export function validateCalculatorState(input: unknown): {
  data: CalculatorState | null;
  invalid: boolean;
} {
  if (input === undefined) return { data: null, invalid: false };
  if (!input || typeof input !== "object" || Array.isArray(input))
    return { data: null, invalid: true };
  const raw = input as Record<string, unknown>;
  if (raw["version"] !== 1 || !["student", "jobseeker", "housing"].includes(String(raw["tab"])))
    return { data: null, invalid: true };
  for (const section of ["student", "general", "housing"] as const) {
    const group = raw[section];
    if (!group || typeof group !== "object" || Array.isArray(group))
      return { data: null, invalid: true };
    const values = group as Record<string, unknown>;
    for (const [key, fallback] of Object.entries(DEFAULT_STATE[section])) {
      const value = values[key];
      if (typeof fallback === "number") {
        const [min, max, integer] = numericRules[key] ?? [0, MAX_MONEY, false];
        if (
          typeof value !== "number" ||
          !Number.isFinite(value) ||
          value < min ||
          value > max ||
          (integer && !Number.isInteger(value)) ||
          Math.abs(value * 100 - Math.round(value * 100)) > 0.00001
        )
          return { data: null, invalid: true };
      } else if (typeof fallback === "boolean") {
        if (typeof value !== "boolean") return { data: null, invalid: true };
      } else if (key === "type") {
        if (!["none", "wage", "capital", "rent", "other", "mixed"].includes(String(value)))
          return { data: null, invalid: true };
      } else if (key === "heatingRegion") {
        if (!["normal", "east", "north"].includes(String(value)))
          return { data: null, invalid: true };
      } else if (
        key === "group" &&
        !MUNICIPAL_GROUPS.includes(value as (typeof MUNICIPAL_GROUPS)[number])
      )
        return { data: null, invalid: true };
    }
  }
  // Rebuild from known keys: never propagate arbitrary URL properties.
  const cleaned = structuredClone(DEFAULT_STATE);
  cleaned.tab = raw["tab"] as CalculatorTab;
  for (const section of ["student", "general", "housing"] as const) {
    for (const key of Object.keys(cleaned[section])) {
      Object.assign(cleaned[section], { [key]: (raw[section] as Record<string, unknown>)[key] });
    }
  }
  const s = cleaned.student;
  if (
    (s.months ?? 0) > (s.studyMonths ?? 0) ||
    (s.partialYear && (s.studyIncome ?? 0) > (s.earned ?? 0) + (s.future ?? 0))
  )
    return { data: null, invalid: true };
  const g = cleaned.general;
  const visibleType = { wages: "wage", capital: "capital", rent: "rent", other: "other" };
  for (const key of ["wages", "capital", "rent", "other"] as const) {
    if (g.type !== "mixed" && g.type !== visibleType[key] && g[key] !== 0)
      return { data: null, invalid: true };
  }
  return { data: cleaned, invalid: false };
}
export function calculationShareUrl(base: string, state: CalculatorState) {
  const validated = validateCalculatorState(state);
  if (!validated.data)
    throw new Error("Korjaa puuttuvat tai virheelliset syötteet ennen jakamista.");
  const url = new URL(base);
  url.search = "";
  url.hash = "";
  url.searchParams.set("data", JSON.stringify(validated.data));
  return url.href;
}
