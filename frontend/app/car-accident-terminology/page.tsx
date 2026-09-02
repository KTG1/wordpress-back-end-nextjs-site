import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, plainText } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Car Accident Terminology",
  description:
    "Plain-English explanations of important car-accident, insurance, and injury-claim terminology.",
};

export default async function CarAccidentTerminologyPage() {
  const posts = await getPosts(50);
  const terminologyPosts = posts
    .filter((post) =>
      plainText(post.title.rendered).startsWith("Car Accident Terminology:"),
    )
    .sort((a, b) =>
      plainText(a.title.rendered).localeCompare(plainText(b.title.rendered)),
    );

  return (
    <main className="term-index" id="main-content">
      <header className="shell term-index-header">
        <div>
          <p className="law-kicker">A plain-English reference</p>
          <h1>Car accident terminology</h1>
        </div>
        <p>
          Understand the words used in crash reports, insurance policies, claim letters,
          and legal conversations. Rules vary by state, so each guide explains the term
          without pretending one definition fits every case.
        </p>
      </header>

      <section className="shell term-directory" aria-labelledby="term-directory-heading">
        <div className="term-directory-heading">
          <h2 id="term-directory-heading">Browse the terminology</h2>
          <span>{terminologyPosts.length} guides</span>
        </div>

        {terminologyPosts.length > 0 ? (
          <ol className="term-list">
            {terminologyPosts.map((post, index) => {
              const title = plainText(post.title.rendered).replace(
                "Car Accident Terminology: ",
                "",
              );

              return (
                <li key={post.id}>
                  <span className="term-number">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>
                      <Link href={`/blog/${post.slug}`}>{title}</Link>
                    </h3>
                    <p>{plainText(post.excerpt.rendered)}</p>
                  </div>
                  <Link aria-label={`Read ${title}`} className="term-read-link" href={`/blog/${post.slug}`}>
                    Read guide
                  </Link>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="empty-state">
            <p>The terminology directory is being prepared.</p>
            <p>Published WordPress articles will appear here automatically.</p>
          </div>
        )}
      </section>

      <aside className="shell term-note">
        <p>
          These guides provide general educational information, not legal or insurance
          advice. Current law, policy language, and the facts of a specific collision control.
        </p>
        <Link className="line-link" href="/blog">
          Browse all writing
        </Link>
      </aside>
    </main>
  );
}
