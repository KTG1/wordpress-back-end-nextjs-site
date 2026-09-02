export type SettlementMoneyKey =
  | "medical"
  | "futureMedical"
  | "lostIncome"
  | "property"
  | "other";

export type SettlementMoneyFields = Record<SettlementMoneyKey, number>;

export type SettlementMoneyFieldCopy = Record<
  SettlementMoneyKey,
  { label: string; hint: string }
>;

export type SettlementImpactBand = {
  label: string;
  detail: string;
  low: number;
  high: number;
};

export type SettlementGuidanceSection = {
  title: string;
  body: string;
};

export type SettlementFaq = {
  question: string;
  answer: string;
};

export type SettlementInternalLink = {
  label: string;
  description: string;
  href: string;
};

export type SettlementCalculatorLabels = {
  pageKicker: string;
  pageTitle: string;
  pageIntro: string;
  pageNote: string;
  formKicker: string;
  formHeading: string;
  resetButton: string;
  financialLegend: string;
  assumptionsLegend: string;
  injuryImpact: string;
  faultShare: string;
  resultLabel: string;
  resultContext: string;
  economicLosses: string;
  impactAssumption: string;
  impactAmount: string;
  faultAdjustment: string;
  formulaSummary: string;
  formulaBody: string;
  copyButton: string;
  copiedButton: string;
  unavailableKicker: string;
  unavailableHeading: string;
  unavailableBody: string;
  guidanceKicker: string;
  guidanceHeading: string;
  linksKicker: string;
  linksHeading: string;
  faqKicker: string;
  faqHeading: string;
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
  labels: SettlementCalculatorLabels;
  moneyFields: SettlementMoneyFieldCopy;
  guidanceSections: SettlementGuidanceSection[];
  faqs: SettlementFaq[];
  internalLinks: SettlementInternalLink[];
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
  labels: {
    pageKicker: "Interactive planning worksheet",
    pageTitle: "Personal injury settlement calculator",
    pageIntro:
      "Enter documented losses, choose an injury-impact assumption, and see how a possible share of fault changes an illustrative range.",
    pageNote: "The result is a transparent scenario—not legal advice, a valuation, or a guarantee.",
    formKicker: "Your working figures",
    formHeading: "Build a planning range",
    resetButton: "Reset values",
    financialLegend: "Documented financial losses",
    assumptionsLegend: "Planning assumptions",
    injuryImpact: "Injury impact",
    faultShare: "Possible share of fault",
    resultLabel: "Educational planning range",
    resultContext:
      "Based only on the figures and assumptions entered here—not a prediction of a settlement or verdict.",
    economicLosses: "Economic losses",
    impactAssumption: "Impact assumption",
    impactAmount: "Illustrative impact amount",
    faultAdjustment: "Fault adjustment",
    formulaSummary: "See the formula",
    formulaBody:
      "(Economic losses + treatment costs × impact assumption) × remaining fault percentage.",
    copyButton: "Copy estimate summary",
    copiedButton: "Estimate copied",
    unavailableKicker: "Calculator status",
    unavailableHeading: "This worksheet is temporarily unavailable.",
    unavailableBody:
      "An administrator can enable it in WordPress under Settings → Settlement Calculator.",
    guidanceKicker: "Read the result carefully",
    guidanceHeading: "What this estimate can—and cannot—tell you",
    linksKicker: "Continue reading",
    linksHeading: "Understand the terms behind the worksheet",
    faqKicker: "Questions before using the range",
    faqHeading: "How to interpret this calculator",
  },
  moneyFields: {
    medical: { label: "Medical expenses", hint: "Paid or outstanding bills" },
    futureMedical: { label: "Expected future care", hint: "Treatment that may still be needed" },
    lostIncome: { label: "Lost income", hint: "Documented earnings already missed" },
    property: { label: "Property damage", hint: "Vehicle and other property" },
    other: { label: "Other documented costs", hint: "Travel, care, equipment, and similar expenses" },
  },
  guidanceSections: [
    {
      title: "What it includes",
      body: "The model combines the financial losses you enter with a disclosed range applied to treatment costs, then applies your selected fault adjustment.",
    },
    {
      title: "What it leaves out",
      body: "State law, insurance limits, medical liens, litigation risk, evidence, credibility, fees, and the individual facts that drive real outcomes.",
    },
    {
      title: "What to do next",
      body: "Verify the numbers with records, review the applicable policy and law, and obtain advice from a licensed professional before making decisions.",
    },
  ],
  faqs: [
    {
      question: "Is this estimate legal advice?",
      answer:
        "No. It is an educational planning range based only on the figures and assumptions entered. A licensed professional must evaluate the facts and law that apply to a real matter.",
    },
    {
      question: "Does the calculator apply my state’s law?",
      answer:
        "No. Negligence rules, damage limits, deadlines, insurance requirements, and available remedies vary by jurisdiction and are not applied by this worksheet.",
    },
    {
      question: "Why does the model use treatment costs?",
      answer:
        "Treatment costs are used as a visible modeling input so the calculation can be explained. The multiplier is an assumption, not a legal rule or a promise that an insurer, judge, or jury will use it.",
    },
    {
      question: "Will an insurer offer the displayed amount?",
      answer:
        "Not necessarily. Coverage, policy limits, liability disputes, documentation, liens, negotiation, and many other facts can materially change an outcome.",
    },
  ],
  internalLinks: [
    {
      label: "Types of damages",
      description: "Learn how economic, non-economic, and punitive damages differ.",
      href: "/blog/car-accident-terminology-economic-non-economic-and-punitive-damages",
    },
    {
      label: "Shared fault",
      description: "Understand comparative and contributory negligence terminology.",
      href: "/blog/car-accident-terminology-comparative-and-contributory-negligence",
    },
    {
      label: "All terminology guides",
      description: "Browse the complete car-accident terminology collection.",
      href: "/car-accident-terminology",
    },
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

function optionalText(value: unknown, maximumLength = 500) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

function safeInternalHref(value: unknown) {
  const href = optionalText(value, 500);

  return href.startsWith("/") && !href.startsWith("//") ? href : "";
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
  const rawLabels = isRecord(value.labels) ? value.labels : {};
  const labels = Object.fromEntries(
    (Object.keys(defaults.labels) as Array<keyof SettlementCalculatorLabels>).map((key) => [
      key,
      safeText(rawLabels[key], defaults.labels[key], 700),
    ]),
  ) as SettlementCalculatorLabels;
  const rawMoneyFields = isRecord(value.moneyFields) ? value.moneyFields : {};
  const moneyFields = Object.fromEntries(
    (Object.keys(defaults.moneyFields) as SettlementMoneyKey[]).map((key) => {
      const field = isRecord(rawMoneyFields[key]) ? rawMoneyFields[key] : {};

      return [
        key,
        {
          label: safeText(field.label, defaults.moneyFields[key].label, 120),
          hint: safeText(field.hint, defaults.moneyFields[key].hint, 240),
        },
      ];
    }),
  ) as SettlementMoneyFieldCopy;
  const guidanceSections = Array.isArray(value.guidanceSections)
    ? value.guidanceSections
        .slice(0, 6)
        .map((item) => {
          const section = isRecord(item) ? item : {};

          return {
            title: optionalText(section.title, 160),
            body: optionalText(section.body, 1_200),
          };
        })
        .filter((section) => section.title && section.body)
    : defaults.guidanceSections;
  const faqs = Array.isArray(value.faqs)
    ? value.faqs
        .slice(0, 12)
        .map((item) => {
          const faq = isRecord(item) ? item : {};

          return {
            question: optionalText(faq.question, 220),
            answer: optionalText(faq.answer, 2_000),
          };
        })
        .filter((faq) => faq.question && faq.answer)
    : defaults.faqs;
  const internalLinks = Array.isArray(value.internalLinks)
    ? value.internalLinks
        .slice(0, 12)
        .map((item) => {
          const link = isRecord(item) ? item : {};

          return {
            label: optionalText(link.label, 140),
            description: optionalText(link.description, 320),
            href: safeInternalHref(link.href),
          };
        })
        .filter((link) => link.label && link.href)
    : defaults.internalLinks;

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
    labels,
    moneyFields,
    guidanceSections,
    faqs,
    internalLinks,
    disclaimer: safeText(value.disclaimer, defaults.disclaimer, 1_000),
  };
}
