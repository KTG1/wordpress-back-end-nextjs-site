import Link from "next/link";

const terminologyLinks = [
  ["Negligence", "/blog/car-accident-terminology-negligence-explained"],
  ["PIP coverage", "/blog/car-accident-terminology-personal-injury-protection-pip"],
  [
    "Uninsured motorists",
    "/blog/car-accident-terminology-uninsured-and-underinsured-motorist-coverage",
  ],
  ["Total loss and ACV", "/blog/car-accident-terminology-actual-cash-value-and-total-loss"],
  [
    "Types of damages",
    "/blog/car-accident-terminology-economic-non-economic-and-punitive-damages",
  ],
  [
    "Claim deadlines",
    "/blog/car-accident-terminology-statute-of-limitations-and-claim-deadlines",
  ],
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-brand">
          <p className="footer-title">The Founder Site</p>
          <p>Independent work, published with intent.</p>
          <Link className="footer-feature-link" href="/car-accident-terminology">
            Explore the car-accident terminology guide
          </Link>
        </div>

        <nav aria-label="Footer site navigation" className="footer-column">
          <p>Explore</p>
          <Link href="/">Home</Link>
          <Link href="/blog">All writing</Link>
          <Link href="/car-accident-terminology">Terminology guide</Link>
          <Link href="/about">About</Link>
        </nav>

        <nav aria-label="Car accident terminology" className="footer-column footer-terms">
          <p>Popular terminology</p>
          <div className="footer-link-grid">
            {terminologyLinks.map(([label, href]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className="shell footer-bottom">
        <p>WordPress editorial system · Next.js delivery</p>
        <div>
          <Link href="/sitemap.xml">Sitemap</Link>
          <Link href="/blog">Archive</Link>
        </div>
      </div>
    </footer>
  );
}
