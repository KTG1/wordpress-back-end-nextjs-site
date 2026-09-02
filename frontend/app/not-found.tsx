import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found shell" id="main-content">
      <p className="kicker">404</p>
      <h1>This page is outside the archive.</h1>
      <p>It may have moved, or WordPress may not have published it yet.</p>
      <Link className="button" href="/">
        Return home
      </Link>
    </main>
  );
}

