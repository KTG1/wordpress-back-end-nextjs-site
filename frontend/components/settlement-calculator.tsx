"use client";

import { useMemo, useState } from "react";
import type {
  SettlementCalculatorConfig,
  SettlementMoneyFields,
  SettlementMoneyKey,
} from "@/lib/settlement-calculator-config";

const moneyKeys: SettlementMoneyKey[] = [
  "medical",
  "futureMedical",
  "lostIncome",
  "property",
  "other",
];

function clampMoney(raw: string, maximum: number) {
  const value = Number(raw);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(maximum, Math.max(0, value));
}

export function SettlementCalculator({ config }: { config: SettlementCalculatorConfig }) {
  const [money, setMoney] = useState<SettlementMoneyFields>(() => ({
    ...config.defaultValues,
  }));
  const [impact, setImpact] = useState(config.defaultImpact);
  const [fault, setFault] = useState(config.defaultFault);
  const [copied, setCopied] = useState(false);
  const moneyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: config.currency,
        maximumFractionDigits: 0,
      }),
    [config.currency],
  );
  const currencySymbol =
    moneyFormatter.formatToParts(0).find((part) => part.type === "currency")?.value ??
    config.currency;

  const result = useMemo(() => {
    const economic = Object.values(money).reduce((sum, value) => sum + value, 0);
    const treatmentBase = money.medical + money.futureMedical;
    const band = config.impactBands[impact];
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
  }, [config.impactBands, fault, impact, money]);

  function updateMoney(key: SettlementMoneyKey, raw: string) {
    setMoney((current) => ({
      ...current,
      [key]: clampMoney(raw, config.maxAmount),
    }));
  }

  function resetCalculator() {
    setMoney({ ...config.defaultValues });
    setImpact(config.defaultImpact);
    setFault(config.defaultFault);
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

  if (!config.enabled) {
    return (
      <section className="settlement-calculator" aria-labelledby="calculator-heading">
        <div className="calculator-unavailable">
          <p className="calculator-kicker">{config.labels.unavailableKicker}</p>
          <h2 id="calculator-heading">{config.labels.unavailableHeading}</h2>
          <p>{config.labels.unavailableBody}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="settlement-calculator" aria-labelledby="calculator-heading">
      <div className="calculator-workspace">
        <form className="calculator-controls" onSubmit={(event) => event.preventDefault()}>
          <div className="calculator-heading">
            <div>
              <p className="calculator-kicker">{config.labels.formKicker}</p>
              <h2 id="calculator-heading">{config.labels.formHeading}</h2>
            </div>
            <button className="calculator-reset" onClick={resetCalculator} type="button">
              {config.labels.resetButton}
            </button>
          </div>

          <fieldset className="calculator-fieldset">
            <legend>{config.labels.financialLegend}</legend>
            <div className="calculator-money-grid">
              {moneyKeys.map((key) => {
                const field = config.moneyFields[key];

                return (
                  <label className="calculator-money-field" key={key}>
                    <span>
                      {field.label}
                      <small>{field.hint}</small>
                    </span>
                    <span className="calculator-currency">
                      <span aria-hidden="true">{currencySymbol}</span>
                      <input
                        aria-label={`${field.label} in ${config.currency}`}
                        inputMode="decimal"
                        max={config.maxAmount}
                        min="0"
                        onChange={(event) => updateMoney(key, event.target.value)}
                        step="100"
                        type="number"
                        value={money[key]}
                      />
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="calculator-fieldset calculator-assumptions">
            <legend>{config.labels.assumptionsLegend}</legend>
            <label className="calculator-range-field">
              <span>
                {config.labels.injuryImpact}
                <strong>{config.impactBands[impact].label}</strong>
              </span>
              <input
                aria-label={config.labels.injuryImpact}
                max={config.impactBands.length - 1}
                min="0"
                onChange={(event) => setImpact(Number(event.target.value))}
                type="range"
                value={impact}
              />
              <small>
                {config.impactBands[impact].detail}; assumes {config.impactBands[impact].low}×–
                {config.impactBands[impact].high}× treatment costs.
              </small>
            </label>

            <label className="calculator-range-field">
              <span>
                {config.labels.faultShare}
                <strong>{fault}%</strong>
              </span>
              <input
                aria-label={config.labels.faultShare}
                max={config.maxFault}
                min="0"
                onChange={(event) => setFault(Number(event.target.value))}
                step={config.faultStep}
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
          <p className="calculator-result-label">{config.labels.resultLabel}</p>
          <div className="calculator-result-range">
            <strong>{moneyFormatter.format(result.low)}</strong>
            <span>to</span>
            <strong>{moneyFormatter.format(result.high)}</strong>
          </div>
          <p className="calculator-result-context">{config.labels.resultContext}</p>

          <dl className="calculator-breakdown">
            <div>
              <dt>{config.labels.economicLosses}</dt>
              <dd>{moneyFormatter.format(result.economic)}</dd>
            </div>
            <div>
              <dt>{config.labels.impactAssumption}</dt>
              <dd>
                {result.band.low}×–{result.band.high}×
              </dd>
            </div>
            <div>
              <dt>{config.labels.impactAmount}</dt>
              <dd>
                {moneyFormatter.format(result.impactLow)}–
                {moneyFormatter.format(result.impactHigh)}
              </dd>
            </div>
            <div>
              <dt>{config.labels.faultAdjustment}</dt>
              <dd>−{fault}%</dd>
            </div>
          </dl>

          <details className="calculator-formula">
            <summary>{config.labels.formulaSummary}</summary>
            <p>{config.labels.formulaBody}</p>
          </details>

          <button className="calculator-copy" onClick={copySummary} type="button">
            {copied ? config.labels.copiedButton : config.labels.copyButton}
          </button>
          <p className="calculator-disclaimer">{config.disclaimer}</p>
        </aside>
      </div>
    </section>
  );
}
