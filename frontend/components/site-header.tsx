import Link from "next/link";

type SiteHeaderProps = {
  siteName?: string;
};

export function SiteHeader({ siteName = "Founder Site" }: SiteHeaderProps) {
  const wordpressUrl = process.env.WORDPRESS_PUBLIC_URL ?? "http://localhost:8080";
  const useDemoContent =
    process.env.STATIC_EXPORT === "true" || process.env.DEMO_CONTENT === "true";

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
          {useDemoContent ? (
            <a
              href="https://github.com/KTG1/wordpress-back-end-nextjs-site"
              rel="noreferrer"
            >
              Repository
            </a>
          ) : (
            <a href={`${wordpressUrl}/wp-admin`} rel="noreferrer">
              Editor
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
