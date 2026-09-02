export type SettlementMoneyKey =
  | "medical"
  | "futureMedical"
  | "lostIncome"
  | "property"
  | "other";

export type SettlementMoneyFields = Record<SettlementMoneyKey, number>;

export type SettlementImpactBand = {
  label: string;
  detail: string;
  low: number;
  high: number;
};

export type SettlementCalculatorConfig = {
  enabled: boolean;
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "TRY";
  maxAmount: number;
  defaultValues: SettlementMoneyFields;
  defaultImpact: number;
  defaultFault: number;
  maxFault: number;
  faultStep: number;
  impactBands: SettlementImpactBand[];
  disclaimer: string;
};

export const defaultSettlementCalculatorConfig: SettlementCalculatorConfig = {
  enabled: true,
  currency: "USD",
  maxAmount: 100_000_000,
  defaultValues: {
    medical: 18_500,
    futureMedical: 6_000,
    lostIncome: 4_200,
    property: 3_500,
    other: 750,
  },
  defaultImpact: 2,
  defaultFault: 0,
  maxFault: 80,
  faultStep: 5,
  impactBands: [
    { label: "Minor", detail: "Short recovery and limited treatment", low: 0.5, high: 1.25 },
    { label: "Moderate", detail: "Weeks of treatment or disruption", low: 1, high: 2.25 },
    { label: "Significant", detail: "Long recovery or lasting symptoms", low: 1.75, high: 3.5 },
    { label: "Severe", detail: "Major treatment or long-term effects", low: 2.75, high: 4.75 },
    { label: "Catastrophic", detail: "Permanent, life-changing injury", low: 4, high: 6.5 },
  ],
  disclaimer:
    "This tool does not apply state law, policy limits, damage caps, liens, fees, coverage disputes, evidence quality, or individual facts. It is educational software—not legal advice, a case valuation, or a promise of recovery.",
};

const allowedCurrencies = new Set<SettlementCalculatorConfig["currency"]>([
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "TRY",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeNumber(value: unknown, fallback: number, minimum: number, maximum: number) {
  const number = typeof value === "number" ? value : Number(value);

  return Number.isFinite(number) ? Math.min(maximum, Math.max(minimum, number)) : fallback;
}

function safeText(value: unknown, fallback: string, maximumLength = 500) {
  if (typeof value !== "string") {
    return fallback;
  }

  const text = value.trim().slice(0, maximumLength);

  return text || fallback;
}

export function normalizeSettlementCalculatorConfig(
  value: unknown,
): SettlementCalculatorConfig {
  if (!isRecord(value)) {
    return defaultSettlementCalculatorConfig;
  }

  const defaults = defaultSettlementCalculatorConfig;
  const rawDefaults = isRecord(value.defaultValues) ? value.defaultValues : {};
  const maxAmount = safeNumber(value.maxAmount, defaults.maxAmount, 1_000, 1_000_000_000);
  const maxFault = Math.round(safeNumber(value.maxFault, defaults.maxFault, 0, 100));
  const currency =
    typeof value.currency === "string" &&
    allowedCurrencies.has(value.currency as SettlementCalculatorConfig["currency"])
      ? (value.currency as SettlementCalculatorConfig["currency"])
      : defaults.currency;
  const impactBands = defaults.impactBands.map((fallback, index) => {
    const rawBands = Array.isArray(value.impactBands) ? value.impactBands : [];
    const band = isRecord(rawBands[index]) ? rawBands[index] : {};
    const low = safeNumber(band.low, fallback.low, 0, 20);
    const high = safeNumber(band.high, fallback.high, low, 20);

    return {
      label: safeText(band.label, fallback.label, 80),
      detail: safeText(band.detail, fallback.detail, 200),
      low,
      high,
    };
  });

  const defaultValues = Object.fromEntries(
    (Object.keys(defaults.defaultValues) as SettlementMoneyKey[]).map((key) => [
      key,
      safeNumber(rawDefaults[key], defaults.defaultValues[key], 0, maxAmount),
    ]),
  ) as SettlementMoneyFields;

  return {
    enabled: typeof value.enabled === "boolean" ? value.enabled : defaults.enabled,
    currency,
    maxAmount,
    defaultValues,
    defaultImpact: Math.round(
      safeNumber(value.defaultImpact, defaults.defaultImpact, 0, impactBands.length - 1),
    ),
    defaultFault: Math.round(
      safeNumber(value.defaultFault, defaults.defaultFault, 0, maxFault),
    ),
    maxFault,
    faultStep: Math.round(safeNumber(value.faultStep, defaults.faultStep, 1, 25)),
    impactBands,
    disclaimer: safeText(value.disclaimer, defaults.disclaimer, 1_000),
  };
}
