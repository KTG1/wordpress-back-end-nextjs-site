import type { Metadata } from "next";
import Link from "next/link";
import { SettlementCalculator } from "@/components/settlement-calculator";
import { getSettlementCalculatorConfig } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Personal Injury Settlement Calculator",
  description:
    "Use documented losses and transparent assumptions to explore an educational personal-injury settlement planning range.",
};

export default async function SettlementCalculatorPage() {
  const calculatorConfig = await getSettlementCalculatorConfig();

  return (
    <main className="calculator-page" id="main-content">
      <header className="shell calculator-intro">
        <div>
          <p className="law-kicker">Interactive planning worksheet</p>
          <h1>Personal injury settlement calculator</h1>
        </div>
        <div className="calculator-intro-copy">
          <p>
            Enter documented losses, choose an injury-impact assumption, and see how a
            possible share of fault changes an illustrative range.
          </p>
          <p>
            The result is a transparent scenario—not legal advice, a valuation, or a
            guarantee.
          </p>
        </div>
      </header>

      <div className="shell">
        <SettlementCalculator config={calculatorConfig} />
      </div>

      <section className="shell calculator-method" aria-labelledby="method-heading">
        <div className="calculator-method-heading">
          <p className="law-kicker">Read the result carefully</p>
          <h2 id="method-heading">What this estimate can—and cannot—tell you</h2>
        </div>

        <div className="calculator-method-grid">
          <article>
            <h3>What it includes</h3>
            <p>
              The model combines the financial losses you enter with a disclosed range
              applied to treatment costs, then applies your selected fault adjustment.
            </p>
          </article>
          <article>
            <h3>What it leaves out</h3>
            <p>
              State law, insurance limits, medical liens, litigation risk, evidence,
              credibility, fees, and the individual facts that drive real outcomes.
            </p>
          </article>
          <article>
            <h3>What to do next</h3>
            <p>
              Verify the numbers with records, review the applicable policy and law, and
              obtain advice from a licensed professional before making decisions.
            </p>
          </article>
        </div>

        <div className="calculator-reading">
          <p>Understand the terms behind the worksheet.</p>
          <div>
            <Link href="/blog/car-accident-terminology-economic-non-economic-and-punitive-damages">
              Types of damages
            </Link>
            <Link href="/blog/car-accident-terminology-comparative-and-contributory-negligence">
              Shared fault
            </Link>
            <Link href="/car-accident-terminology">All terminology guides</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
