import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_STATE, type CalculatorState } from "@/lib/calculator-state";

const CalculatorContext = createContext<{
  state: CalculatorState;
  update: <K extends keyof CalculatorState>(section: K, value: CalculatorState[K]) => void;
} | null>(null);
export function CalculatorProvider({
  initial,
  children,
}: {
  initial: CalculatorState | null;
  children: ReactNode;
}) {
  const [state, setState] = useState<CalculatorState>(initial ?? structuredClone(DEFAULT_STATE));
  useEffect(() => {
    if (initial) setState(initial);
    else
      setState((s) => ({
        ...s,
        student: { ...s.student, currentMonth: new Date().getMonth() + 1 },
      }));
  }, [initial]);
  return (
    <CalculatorContext.Provider
      value={{ state, update: (section, value) => setState((s) => ({ ...s, [section]: value })) }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}
export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (!context) throw new Error("Laskurin tila puuttuu.");
  return context;
}
