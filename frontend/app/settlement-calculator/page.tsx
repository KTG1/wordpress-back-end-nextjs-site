import type { Metadata } from "next";
import Link from "next/link";
import { SettlementCalculator } from "@/components/settlement-calculator";
import { getSettlementCalculatorConfig } from "@/lib/wordpress";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSettlementCalculatorConfig();

  return {
    title: config.labels.pageTitle,
    description: config.labels.pageIntro,
  };
}

export default async function SettlementCalculatorPage() {
  const calculatorConfig = await getSettlementCalculatorConfig();

  return (
    <main className="calculator-page" id="main-content">
      <header className="shell calculator-intro">
        <div>
          <p className="law-kicker">{calculatorConfig.labels.pageKicker}</p>
          <h1>{calculatorConfig.labels.pageTitle}</h1>
        </div>
        <div className="calculator-intro-copy">
          <p>{calculatorConfig.labels.pageIntro}</p>
          <p>{calculatorConfig.labels.pageNote}</p>
        </div>
      </header>

      <div className="shell">
        <SettlementCalculator config={calculatorConfig} />
      </div>

      <section className="shell calculator-method" aria-labelledby="method-heading">
        <div className="calculator-method-heading">
          <p className="law-kicker">{calculatorConfig.labels.guidanceKicker}</p>
          <h2 id="method-heading">{calculatorConfig.labels.guidanceHeading}</h2>
        </div>

        <div className="calculator-method-grid">
          {calculatorConfig.guidanceSections.map((section, index) => (
            <article key={`${section.title}-${index}`}>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      {calculatorConfig.internalLinks.length > 0 ? (
        <section className="shell calculator-resources" aria-labelledby="resources-heading">
          <div className="calculator-section-heading">
            <p className="law-kicker">{calculatorConfig.labels.linksKicker}</p>
            <h2 id="resources-heading">{calculatorConfig.labels.linksHeading}</h2>
          </div>
          <nav className="calculator-resource-list" aria-label={calculatorConfig.labels.linksHeading}>
            {calculatorConfig.internalLinks.map((link) => (
              <Link href={link.href} key={`${link.href}-${link.label}`}>
                <strong>{link.label}</strong>
                {link.description ? <span>{link.description}</span> : null}
              </Link>
            ))}
          </nav>
        </section>
      ) : null}

      {calculatorConfig.faqs.length > 0 ? (
        <section className="shell calculator-faq" aria-labelledby="faq-heading">
          <div className="calculator-section-heading">
            <p className="law-kicker">{calculatorConfig.labels.faqKicker}</p>
            <h2 id="faq-heading">{calculatorConfig.labels.faqHeading}</h2>
          </div>
          <div className="calculator-faq-list">
            {calculatorConfig.faqs.map((faq, index) => (
              <details key={`${faq.question}-${index}`}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
