const eur0 = new Intl.NumberFormat("fi-FI", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const eur2 = new Intl.NumberFormat("fi-FI", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const num0 = new Intl.NumberFormat("fi-FI", { maximumFractionDigits: 0 });

export const euro = (n: number) => eur0.format(Math.round(n));
export const euroCents = (n: number) => eur2.format(n);
export const num = (n: number) => num0.format(n);
export const signedEuro = (n: number) => (n > 0 ? "+" : n < 0 ? "−" : "") + euro(Math.abs(n));
