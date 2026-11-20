import { fireEvent, render, screen, cleanup, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CalculatorProvider } from "@/components/calc/CalculatorContext";
import { StudentTab } from "@/components/calc/StudentTab";
import { GeneralSupportTab } from "@/components/calc/GeneralSupportTab";
import { HousingTab } from "@/components/calc/HousingTab";
import { DEFAULT_STATE, validateCalculatorState } from "@/lib/calculator-state";
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
describe("Laskurien syötteet ja tulokset", () => {
  it("opiskelijan toteutunut tulo päivittyy ja virhe estää laskelman", () => {
    render(
      <CalculatorProvider initial={DEFAULT_STATE}>
        <StudentTab />
      </CalculatorProvider>,
    );
    const input = screen.getByLabelText("Toteutuneet veronalaiset tulot");
    fireEvent.change(input, { target: { value: "25000,01" } });
    expect(screen.getByText("27 000,01 €")).toBeInTheDocument();
    expect(screen.getByText("4 kk")).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "" } });
    expect(input).toHaveValue("");
    expect(screen.getByText(/Arviota ei lasketa puutteellisista/)).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "-123" } });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText(/Arviota ei lasketa puutteellisista/)).toBeInTheDocument();
  });
  it("pääomatulo ei käytä palkkatulon sääntöä", () => {
    render(
      <CalculatorProvider initial={DEFAULT_STATE}>
        <GeneralSupportTab />
      </CalculatorProvider>,
    );
    fireEvent.change(screen.getByLabelText("Tulolaji"), { target: { value: "capital" } });
    fireEvent.change(screen.getByLabelText("Pääomatulo / kk"), { target: { value: "411" } });
    expect(screen.getByText("750,02 €")).toBeInTheDocument();
  });
  it("asumistuen kaikkia numerokenttiä voidaan muuttaa ja puute estää tuloksen", () => {
    render(
      <CalculatorProvider initial={DEFAULT_STATE}>
        <HousingTab />
      </CalculatorProvider>,
    );
    for (const input of screen.getAllByRole("textbox")) {
      const previous = (input as HTMLInputElement).value;
      const name = input.getAttribute("id");
      expect(name).toBeTruthy();
      fireEvent.change(input, { target: { value: "1" } });
      expect(input).toHaveValue("1");
      fireEvent.change(input, { target: { value: previous } });
    }
    fireEvent.change(screen.getByLabelText("Ruokakunnan kaikki huomioitavat tulot / kk (brutto)"), {
      target: { value: "" },
    });
    expect(screen.getByText(/Arviota ei lasketa puutteellisista/)).toBeInTheDocument();
  });
  it("kopioitu linkki sisältää muutetut tiedot ja tulostus käynnistyy", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    const print = vi.spyOn(window, "print").mockImplementation(() => {});
    render(
      <CalculatorProvider initial={DEFAULT_STATE}>
        <StudentTab />
      </CalculatorProvider>,
    );
    fireEvent.change(screen.getByLabelText("Toteutuneet veronalaiset tulot"), {
      target: { value: "23456,78" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Kopioi linkki laskuriin" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    const url = new URL(writeText.mock.calls[0]?.[0] as string);
    expect(
      validateCalculatorState(JSON.parse(url.searchParams.get("data") ?? "null")).data?.student
        .earned,
    ).toBe(23456.78);
    expect(await screen.findByRole("button", { name: "Linkki kopioitu!" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Tulosta laskelma" }));
    expect(print).toHaveBeenCalledTimes(1);
  });
  it("kopioinnin epäonnistumista ei ilmoiteta onnistumiseksi", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn(() => false),
    });
    render(
      <CalculatorProvider initial={DEFAULT_STATE}>
        <StudentTab />
      </CalculatorProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Kopioi linkki laskuriin" }));
    expect(await screen.findByText(/Kopiointi ei onnistunut/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Linkki kopioitu!" })).not.toBeInTheDocument();
  });
});
