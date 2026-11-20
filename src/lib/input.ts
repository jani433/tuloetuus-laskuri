export const MAX_MONEY = 100_000_000;
export type NumericInput = number | null;

export function parseNumericInput(
  raw: string,
  min = 0,
  max = MAX_MONEY,
  integer = false,
): { value: NumericInput; error?: string } {
  const text = raw.trim().replace(/−/g, "-").replace(/\s/g, "").replace(",", ".");
  if (!text) return { value: null, error: "Täytä kenttä." };
  if (!/^-?\d+(?:\.\d{1,2})?$/.test(text))
    return { value: null, error: "Anna luku, enintään kahdella desimaalilla (esim. 123,45)." };
  const value = Number(text);
  if (
    !Number.isFinite(value) ||
    value < min ||
    value > max ||
    (integer && !Number.isInteger(value))
  ) {
    return {
      value: null,
      error: `Anna ${integer ? "kokonaisluku" : "luku"} väliltä ${min}–${max}.`,
    };
  }
  return { value };
}
