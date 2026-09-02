import Link from "next/link";

type SiteHeaderProps = {
  siteName?: string;
};

export function SiteHeader({ siteName = "Founder Site" }: SiteHeaderProps) {
  const wordpressUrl = process.env.WORDPRESS_PUBLIC_URL ?? "http://localhost:8080";

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="wordmark" href="/">
          <span aria-hidden="true" className="wordmark-mark">
            F
          </span>
          <span>{siteName}</span>
        </Link>
        <nav aria-label="Primary navigation" className="primary-nav">
          <Link href="/">Home</Link>
          <Link href="/blog">Writing</Link>
          <a href={`${wordpressUrl}/wp-admin`} rel="noreferrer">
            Editor
          </a>
        </nav>
      </div>
    </header>
  );
}

