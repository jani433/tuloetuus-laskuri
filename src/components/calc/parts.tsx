import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Link2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseNumericInput, MAX_MONEY, type NumericInput } from "@/lib/input";
import { calculationShareUrl } from "@/lib/calculator-state";
import { useCalculator } from "./CalculatorContext";
import { cn } from "@/lib/utils";

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cn("min-w-0 rounded-2xl border bg-card p-5 shadow-card sm:p-6", className)}>
      {children}
    </section>
  );
}

export function PanelTitle({ step, children }: { step?: string; children: ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      {step && (
        <span className="grid h-6 w-6 place-items-center rounded-full bg-secondary text-xs font-bold text-primary">
          {step}
        </span>
      )}
      <h2 className="text-base font-bold text-foreground">{children}</h2>
    </div>
  );
}

const statValue = cva("figure break-words", {
  variants: {
    tone: {
      default: "text-foreground",
      success: "text-success",
      warning: "text-warning-foreground",
      danger: "text-destructive",
      inverse: "text-primary-foreground",
    },
    size: {
      xl: "text-5xl sm:text-6xl",
      lg: "text-3xl sm:text-4xl",
      md: "text-2xl",
    },
  },
  defaultVariants: { tone: "default", size: "md" },
});

export function Stat({
  label,
  value,
  hint,
  tone,
  size,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
} & VariantProps<typeof statValue> & { className?: string }) {
  return (
    <div className={className}>
      <div
        className={cn(
          "mb-2 text-xs font-semibold uppercase",
          tone === "inverse" ? "text-primary-foreground/70" : "text-muted-foreground",
        )}
      >
        {label}
      </div>
      <div className={statValue({ tone, size })}>{value}</div>
      {hint && (
        <div
          className={cn(
            "mt-2 text-sm",
            tone === "inverse" ? "text-primary-foreground/75" : "text-muted-foreground",
          )}
        >
          {hint}
        </div>
      )}
    </div>
  );
}

const callout = cva("flex gap-3 rounded-xl border p-4 text-sm leading-relaxed", {
  variants: {
    tone: {
      info: "border-border bg-secondary text-secondary-foreground",
      success: "border-success/25 bg-success-soft text-accent-foreground",
      warning: "border-warning/40 bg-warning-soft text-warning-foreground",
      danger: "border-destructive/25 bg-destructive-soft text-destructive",
    },
  },
  defaultVariants: { tone: "info" },
});

export function Callout({
  tone,
  icon,
  title,
  children,
}: VariantProps<typeof callout> & { icon?: ReactNode; title?: string; children: ReactNode }) {
  return (
    <div className={callout({ tone })} role={tone === "danger" ? "alert" : undefined}>
      {icon && <div className="mt-0.5 shrink-0">{icon}</div>}
      <div>
        {title && <div className="mb-0.5 font-bold">{title}</div>}
        <div className="opacity-90">{children}</div>
      </div>
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  suffix = "€",
  allowNegative = false,
  hint,
  min,
  max = MAX_MONEY,
  integer = false,
}: {
  label: string;
  value: NumericInput;
  onChange: (n: NumericInput) => void;
  suffix?: string;
  allowNegative?: boolean;
  hint?: ReactNode;
  min?: number;
  max?: number;
  integer?: boolean;
}) {
  const id = useId();
  const [text, setText] = useState(value === null ? "" : String(value));
  const last = useRef(value);
  useEffect(() => {
    if (value !== last.current) {
      setText(value === null ? "" : String(value));
      last.current = value;
    }
  }, [value]);
  const parsed = parseNumericInput(text, min ?? (allowNegative ? -MAX_MONEY : 0), max, integer);
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-foreground">
        {label}
      </label>
      <div className="flex items-center rounded-xl border border-input bg-background focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/15">
        <input
          id={id}
          inputMode={integer ? "numeric" : "decimal"}
          aria-invalid={!!parsed.error}
          aria-describedby={`${id}-hint`}
          className="figure w-full min-w-0 bg-transparent px-4 py-3.5 text-2xl font-bold text-foreground outline-none"
          value={text}
          onChange={(e) => {
            const raw = e.target.value;
            setText(raw);
            const next = parseNumericInput(
              raw,
              min ?? (allowNegative ? -MAX_MONEY : 0),
              max,
              integer,
            ).value;
            last.current = next;
            onChange(next);
          }}
        />
        <span className="pr-4 text-base font-semibold text-muted-foreground">{suffix}</span>
      </div>
      <div id={`${id}-hint`}>
        {parsed.error ? (
          <p role="alert" className="mt-2 text-xs text-destructive">
            {parsed.error}
          </p>
        ) : (
          hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    </div>
  );
}

export function CopyLinkButton() {
  const { state } = useCalculator();
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const copy = async () => {
    try {
      const url = calculationShareUrl(window.location.href, state);
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        try {
          if (!document.execCommand("copy"))
            throw new Error("Kopiointi ei onnistunut. Tarkista selaimen leikepöytäoikeudet.");
        } finally {
          ta.remove();
        }
      }
      setStatus("Linkki kopioitu!");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Kopiointi ei onnistunut.");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 3000);
  };
  return (
    <div className="mt-5 print:hidden">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={copy}
          className="text-muted-foreground"
        >
          {status === "Linkki kopioitu!" ? <Check /> : <Link2 />}
          {status === "Linkki kopioitu!" ? status : "Kopioi linkki laskuriin"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => window.print()}
          className="text-muted-foreground"
        >
          <Printer />
          Tulosta laskelma
        </Button>
      </div>
      <p role="status" className="mt-1 text-xs text-muted-foreground">
        {status !== "Linkki kopioitu!" ? status : ""}
      </p>
    </div>
  );
}

export function EstimateNotice({ source }: { source: string }) {
  return (
    <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
      Laskennallinen arvio vuoden 2026 säännöillä, ei Kelan virallinen päätös.{" "}
      <a href={source} target="_blank" rel="noopener noreferrer" className="underline">
        Kelan laskentaperusteet
      </a>
      . Tarkista erityistilanteet OmaKelasta.
    </p>
  );
}
export function MissingResult() {
  return (
    <Callout tone="warning">
      Täytä puuttuvat kentät ja korjaa virheelliset arvot. Arviota ei lasketa puutteellisista
      tiedoista.
    </Callout>
  );
}

export function SliderHeader({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <span className="figure text-2xl text-primary">{value}</span>
    </div>
  );
}
