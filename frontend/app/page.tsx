import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { getPosts, getSiteSettings } from "@/lib/wordpress";

export default async function HomePage() {
  const [site, posts] = await Promise.all([getSiteSettings(), getPosts(3)]);
  const isConnected = Boolean(site);
  const useDemoContent =
    process.env.STATIC_EXPORT === "true" || process.env.DEMO_CONTENT === "true";

  return (
    <main id="main-content">
      <section className="hero shell">
        <div className="hero-signal" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="hero-copy">
          <p className="kicker">Strategy, systems, and field notes</p>
          <h1>{site?.description || "Build the work. Explain the thinking."}</h1>
          <p className="hero-summary">
            A direct record of experiments, decisions, and durable lessons from the work
            behind meaningful growth.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/blog">
              Read the field notes
            </Link>
            <span className={`connection-state ${isConnected ? "is-live" : ""}`}>
              <span aria-hidden="true" />
              {useDemoContent
                ? "WordPress snapshot"
                : isConnected
                  ? "WordPress connected"
                  : "Waiting for WordPress"}
            </span>
          </div>
        </div>
        <aside className="hero-aside" aria-label="Publishing approach">
          <p>Editorial principle</p>
          <blockquote>
            Publish only what makes the next decision clearer.
          </blockquote>
        </aside>
      </section>

      <section className="notes-section shell" aria-labelledby="latest-notes">
        <div className="section-heading">
          <h2 id="latest-notes">Latest writing</h2>
          <Link href="/blog">Browse the archive</Link>
        </div>

        {posts.length > 0 ? (
          <div className="post-grid">
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} priority={index === 0} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No published notes yet.</p>
            <p>
              Start WordPress, publish the first post, and it will appear here automatically.
            </p>
          </div>
        )}
      </section>

      <section className="system-strip">
        <div className="shell system-strip-inner">
          <p>One editorial source</p>
          <span aria-hidden="true" />
          <p>{useDemoContent ? "Fast managed delivery" : "Fast server rendering"}</p>
          <span aria-hidden="true" />
          <p>{useDemoContent ? "Ready for a live WordPress URL" : "Automatic publishing updates"}</p>
        </div>
      </section>
    </main>
  );
}
