import { describe, expect, it } from "vitest";
import { calcGeneralSupport, calcHousing, calcStudent, studentAnnualLimit } from "@/lib/calc";

describe("Opintotuki 2026", () => {
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
    expect(calcHousing(300, 400).mustNotify).toBe(true);
  });
  it("nousu 399 €/kk ei vaadi ilmoitusta", () => {
    expect(calcHousing(300, 399).mustNotify).toBe(false);
  });
  it("lasku 200 €/kk vaatii ilmoituksen", () => {
    expect(calcHousing(300, -200).mustNotify).toBe(true);
  });
  it("lasku 199 €/kk ei vaadi ilmoitusta", () => {
    expect(calcHousing(300, -199).mustNotify).toBe(false);
  });
});
