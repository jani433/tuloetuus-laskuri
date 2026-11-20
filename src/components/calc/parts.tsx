import { useEffect, useId, useState, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cn("rounded-2xl border bg-card p-5 shadow-card sm:p-6", className)}>
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

const statValue = cva("figure", {
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
          "mb-2 text-xs font-semibold uppercase tracking-wider",
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

function parseNumber(raw: string) {
  const cleaned = raw.replace(/\s/g, "").replace(",", ".").replace(/[^\d.-]/g, "");
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function NumberField({
  label,
  value,
  onChange,
  suffix = "€",
  allowNegative = false,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
  allowNegative?: boolean;
  hint?: ReactNode;
}) {
  const id = useId();
  const [text, setText] = useState(String(value));

  useEffect(() => {
    if (parseNumber(text) !== value) setText(String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-foreground">
        {label}
      </label>
      <div className="flex items-center rounded-xl border border-input bg-background transition-shadow focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/15">
        <input
          id={id}
          inputMode={allowNegative ? "text" : "decimal"}
          className="figure w-full min-w-0 bg-transparent px-4 py-3.5 text-2xl font-bold text-foreground outline-none"
          value={text}
          onChange={(e) => {
            const raw = e.target.value;
            setText(raw);
            let n = parseNumber(raw);
            if (!allowNegative) n = Math.abs(n);
            onChange(n);
          }}
        />
        <span className="pr-4 text-base font-semibold text-muted-foreground">{suffix}</span>
      </div>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
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
