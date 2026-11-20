import { describe, expect, it } from "vitest";
import { parseNumericInput } from "@/lib/input";
import {
  DEFAULT_STATE,
  calculationShareUrl,
  validateCalculatorState,
  validateCalculatorSearch,
} from "@/lib/calculator-state";
describe("Syötteiden validointi", () => {
  it("tyhjä ei ole nolla", () => expect(parseNumericInput("").value).toBeNull());
  it("suomalainen pilkku ja välilyönnit", () =>
    expect(parseNumericInput("1 234,56").value).toBe(1234.56));
  it("miinus sallitaan vain muutoskentässä", () => {
    expect(parseNumericInput("−250", -1000).value).toBe(-250);
    expect(parseNumericInput("-250").value).toBeNull();
  });
  it.each(["abc123", "1,2,3", "Infinity", "1e20", "100000001", "1.234"])(
    "virheellinen %s torjutaan",
    (raw) => expect(parseNumericInput(raw).value).toBeNull(),
  );
  it("kuukaudet ovat kokonaislukuja 0–12", () => {
    expect(parseNumericInput("12", 0, 12, true).value).toBe(12);
    expect(parseNumericInput("13", 0, 12, true).value).toBeNull();
    expect(parseNumericInput("1,5", 0, 12, true).value).toBeNull();
  });
});
describe("Jaettu laskelma", () => {
  it.each([null, undefined, "null", "undefined", "NaN", NaN])(
    "torjuu virheellisen data-parametrin %s myös sen ollessa määrittelemätön",
    (data) => expect(validateCalculatorSearch({ data }).invalid).toBe(true),
  );
  it("torjuu invalid=true-parametrin myös ilman data-parametria", () => {
    expect(validateCalculatorSearch({ invalid: true }).invalid).toBe(true);
    expect(validateCalculatorSearch({ data: DEFAULT_STATE, invalid: true }).invalid).toBe(true);
    expect(validateCalculatorSearch({}).invalid).toBe(false);
    expect(validateCalculatorSearch({ data: DEFAULT_STATE }).data).toEqual(DEFAULT_STATE);
  });
  it.each(["student", "jobseeker", "housing"] as const)(
    "palauttaa %s-välilehden ja jokaisen syötteen",
    (tab) => {
      const state = structuredClone(DEFAULT_STATE);
      state.tab = tab;
      state.student.currentMonth = 11;
      state.general.type = "mixed";
      state.general.capital = 411.25;
      state.housing.extraSpace = true;
      state.housing.heatingRegion = "north";
      const url = new URL(
        calculationShareUrl(
          "https://tuloetuus-laskuri.vercel.app/?data=null&invalid=true#ä&%",
          state,
        ),
      );
      expect([...url.searchParams.keys()]).toEqual(["data"]);
      expect(
        validateCalculatorState(JSON.parse(url.searchParams.get("data") ?? "null")).data,
      ).toEqual(state);
    },
  );
  it.each([
    "ä&?=%#🚫",
    "%7Bbroken",
    "null",
    { ...DEFAULT_STATE, version: 0 },
    { ...DEFAULT_STATE, housing: {} },
  ])("hylkää erikoismerkit, puutteet ja vanhan version", (raw) => {
    expect(validateCalculatorState(raw).invalid).toBe(true);
  });
  it("piilotetut tulot ja ristiriitaiset kuukaudet hylätään", () => {
    expect(
      validateCalculatorState({
        ...DEFAULT_STATE,
        general: { ...DEFAULT_STATE.general, type: "none" },
      }).invalid,
    ).toBe(true);
    expect(
      validateCalculatorState({
        ...DEFAULT_STATE,
        student: { ...DEFAULT_STATE.student, studyMonths: 8 },
      }).invalid,
    ).toBe(true);
  });
  it("kaikki kolmen laskurin syötteet säilyvät", () => {
    const s = structuredClone(DEFAULT_STATE);
    s.tab = "housing";
    s.housing.income = 1234.56;
    s.student.months = 0;
    s.general.type = "mixed";
    const url = new URL(calculationShareUrl("https://example.com/?old=1#x", s));
    expect(
      validateCalculatorState(JSON.parse(url.searchParams.get("data") ?? "null")).data,
    ).toEqual(s);
    expect(url.hash).toBe("");
    expect(url.searchParams.has("old")).toBe(false);
  });
  it.each([
    null,
    {},
    "bad",
    { ...DEFAULT_STATE, version: 2 },
    { ...DEFAULT_STATE, student: { ...DEFAULT_STATE.student, months: 99 } },
    { ...DEFAULT_STATE, housing: { ...DEFAULT_STATE.housing, income: -1 } },
    { ...DEFAULT_STATE, general: { ...DEFAULT_STATE.general, type: "bad" } },
  ])("manipuloitu tieto hylätään", (raw) =>
    expect(validateCalculatorState(raw).invalid).toBe(true),
  );
  it("puuttuva kenttä tai null-arvo ei kelpaa jakolinkkiin", () => {
    expect(
      validateCalculatorState({
        ...DEFAULT_STATE,
        student: { ...DEFAULT_STATE.student, earned: null },
      }).invalid,
    ).toBe(true);
    expect(() =>
      calculationShareUrl("https://example.com", {
        ...DEFAULT_STATE,
        student: { ...DEFAULT_STATE.student, earned: null },
      }),
    ).toThrow();
  });
});
