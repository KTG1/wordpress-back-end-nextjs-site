"use client";

import { useMemo, useState } from "react";

type MoneyKey = "medical" | "futureMedical" | "lostIncome" | "property" | "other";
type MoneyFields = Record<MoneyKey, number>;

const moneyFields: Array<{ key: MoneyKey; label: string; hint: string }> = [
  { key: "medical", label: "Medical expenses", hint: "Paid or outstanding bills" },
  { key: "futureMedical", label: "Expected future care", hint: "Treatment that may still be needed" },
  { key: "lostIncome", label: "Lost income", hint: "Documented earnings already missed" },
  { key: "property", label: "Property damage", hint: "Vehicle and other property" },
  { key: "other", label: "Other documented costs", hint: "Travel, care, equipment, and similar expenses" },
];

const impactBands = [
  { label: "Minor", detail: "Short recovery and limited treatment", low: 0.5, high: 1.25 },
  { label: "Moderate", detail: "Weeks of treatment or disruption", low: 1, high: 2.25 },
  { label: "Significant", detail: "Long recovery or lasting symptoms", low: 1.75, high: 3.5 },
  { label: "Severe", detail: "Major treatment or long-term effects", low: 2.75, high: 4.75 },
  { label: "Catastrophic", detail: "Permanent, life-changing injury", low: 4, high: 6.5 },
] as const;

const initialMoney: MoneyFields = {
  medical: 18500,
  futureMedical: 6000,
  lostIncome: 4200,
  property: 3500,
  other: 750,
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function clampMoney(raw: string) {
  const value = Number(raw);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100_000_000, Math.max(0, value));
}

export function SettlementCalculator() {
  const [money, setMoney] = useState<MoneyFields>(initialMoney);
  const [impact, setImpact] = useState(2);
  const [fault, setFault] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const economic = Object.values(money).reduce((sum, value) => sum + value, 0);
    const treatmentBase = money.medical + money.futureMedical;
    const band = impactBands[impact];
    const faultFactor = 1 - fault / 100;
    const impactLow = treatmentBase * band.low;
    const impactHigh = treatmentBase * band.high;

    return {
      band,
      economic,
      impactHigh,
      impactLow,
      high: (economic + impactHigh) * faultFactor,
      low: (economic + impactLow) * faultFactor,
    };
  }, [fault, impact, money]);

  function updateMoney(key: MoneyKey, raw: string) {
    setMoney((current) => ({ ...current, [key]: clampMoney(raw) }));
  }

  function resetCalculator() {
    setMoney(initialMoney);
    setImpact(2);
    setFault(0);
    setCopied(false);
  }

  async function copySummary() {
    if (!navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(
      `Educational settlement planning range: ${moneyFormatter.format(result.low)}–${moneyFormatter.format(result.high)}. Economic losses entered: ${moneyFormatter.format(result.economic)}. Impact assumption: ${result.band.low}×–${result.band.high}× treatment costs. Possible fault adjustment: ${fault}%. This is not legal advice or a case valuation.`,
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  }

  return (
    <section className="settlement-calculator" aria-labelledby="calculator-heading">
      <div className="calculator-workspace">
        <form className="calculator-controls" onSubmit={(event) => event.preventDefault()}>
          <div className="calculator-heading">
            <div>
              <p className="calculator-kicker">Your working figures</p>
              <h2 id="calculator-heading">Build a planning range</h2>
            </div>
            <button className="calculator-reset" onClick={resetCalculator} type="button">
              Reset values
            </button>
          </div>

          <fieldset className="calculator-fieldset">
            <legend>Documented financial losses</legend>
            <div className="calculator-money-grid">
              {moneyFields.map((field) => (
                <label className="calculator-money-field" key={field.key}>
                  <span>
                    {field.label}
                    <small>{field.hint}</small>
                  </span>
                  <span className="calculator-currency">
                    <span aria-hidden="true">$</span>
                    <input
                      aria-label={`${field.label} in dollars`}
                      inputMode="decimal"
                      max="100000000"
                      min="0"
                      onChange={(event) => updateMoney(field.key, event.target.value)}
                      step="100"
                      type="number"
                      value={money[field.key]}
                    />
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="calculator-fieldset calculator-assumptions">
            <legend>Planning assumptions</legend>
            <label className="calculator-range-field">
              <span>
                Injury impact
                <strong>{impactBands[impact].label}</strong>
              </span>
              <input
                aria-label="Injury impact"
                max="4"
                min="0"
                onChange={(event) => setImpact(Number(event.target.value))}
                type="range"
                value={impact}
              />
              <small>
                {impactBands[impact].detail}; assumes {impactBands[impact].low}×–
                {impactBands[impact].high}× treatment costs.
              </small>
            </label>

            <label className="calculator-range-field">
              <span>
                Possible share of fault
                <strong>{fault}%</strong>
              </span>
              <input
                aria-label="Possible share of fault"
                max="80"
                min="0"
                onChange={(event) => setFault(Number(event.target.value))}
                step="5"
                type="range"
                value={fault}
              />
              <small>
                This applies a simple percentage reduction. State negligence rules may work
                differently.
              </small>
            </label>
          </fieldset>
        </form>

        <aside className="calculator-result" aria-live="polite">
          <p className="calculator-result-label">Educational planning range</p>
          <div className="calculator-result-range">
            <strong>{moneyFormatter.format(result.low)}</strong>
            <span>to</span>
            <strong>{moneyFormatter.format(result.high)}</strong>
          </div>
          <p className="calculator-result-context">
            Based only on the figures and assumptions entered here—not a prediction of a
            settlement or verdict.
          </p>

          <dl className="calculator-breakdown">
            <div>
              <dt>Economic losses</dt>
              <dd>{moneyFormatter.format(result.economic)}</dd>
            </div>
            <div>
              <dt>Impact assumption</dt>
              <dd>
                {result.band.low}×–{result.band.high}×
              </dd>
            </div>
            <div>
              <dt>Illustrative impact amount</dt>
              <dd>
                {moneyFormatter.format(result.impactLow)}–
                {moneyFormatter.format(result.impactHigh)}
              </dd>
            </div>
            <div>
              <dt>Fault adjustment</dt>
              <dd>−{fault}%</dd>
            </div>
          </dl>

          <details className="calculator-formula">
            <summary>See the formula</summary>
            <p>
              (Economic losses + treatment costs × impact assumption) × remaining fault
              percentage.
            </p>
          </details>

          <button className="calculator-copy" onClick={copySummary} type="button">
            {copied ? "Estimate copied" : "Copy estimate summary"}
          </button>
          <p className="calculator-disclaimer">
            This tool does not apply state law, policy limits, damage caps, liens, fees,
            coverage disputes, evidence quality, or individual facts. It is educational
            software—not legal advice, a case valuation, or a promise of recovery.
          </p>
        </aside>
      </div>
    </section>
  );
}
