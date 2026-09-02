import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { getPosts, getSiteSettings, plainText } from "@/lib/wordpress";

const principles = [
  "Make the useful signal obvious.",
  "Build systems that survive momentum.",
  "Publish the thinking behind the work.",
];

const capabilities = [
  {
    title: "Strategy",
    copy: "Turn a complicated ambition into a sequence of decisions people can act on.",
  },
  {
    title: "Editorial systems",
    copy: "Create a publishing rhythm that captures useful thinking without slowing the work.",
  },
  {
    title: "Building in public",
    copy: "Share real lessons with enough detail to earn attention, trust, and better conversations.",
  },
];

export default async function HomePage() {
  const [site, posts] = await Promise.all([getSiteSettings(), getPosts(3)]);
  const latestPost = posts[0];
  const isConnected = Boolean(site);

  return (
    <main id="main-content">
      {latestPost ? (
        <Link className="announcement" href={`/blog/${latestPost.slug}`}>
          <span>New field note</span>
          <strong>{plainText(latestPost.title.rendered)}</strong>
          <span className="announcement-action">Read it</span>
        </Link>
      ) : null}

      <section className="law-hero">
        <Image
          alt="A founder and strategic advisor in a modern office"
          className="law-hero-image"
          fill
          priority
          sizes="100vw"
          src="/images/founder-hero-original.png"
        />
        <div aria-hidden="true" className="law-hero-wash" />
        <div className="law-hero-inner shell">
          <div className="law-hero-copy">
            <p className="law-kicker">Strategy, systems, and field notes</p>
            <h1>{site?.description || "Build the work. Explain the thinking."}</h1>
            <p className="law-hero-summary">
              A direct record of the decisions, experiments, and durable lessons behind
              meaningful work.
            </p>
            <div className="law-hero-actions">
              <Link className="law-button law-button-primary" href="/blog">
                Explore the field notes
              </Link>
              <Link className="law-button law-button-quiet" href="/about">
                About this work
              </Link>
            </div>
          </div>

          <aside className="principle-panel" aria-label="Working principles">
            <p>Working principles</p>
            <ol>
              {principles.map((principle) => (
                <li key={principle}>{principle}</li>
              ))}
            </ol>
            <span className={`connection-state ${isConnected ? "is-live" : ""}`}>
              <span aria-hidden="true" />
              {isConnected ? "Publishing system connected" : "Connecting the publishing system"}
            </span>
          </aside>
        </div>
        <div className="vertical-signal">Work with intent</div>
      </section>

      <section className="proof-band" aria-label="Publishing system highlights">
        <div className="shell proof-band-inner">
          <p>
            <strong>One</strong>
            <span>editorial source</span>
          </p>
          <p>
            <strong>60 sec</strong>
            <span>content refresh</span>
          </p>
          <p>
            <strong>Global</strong>
            <span>managed delivery</span>
          </p>
        </div>
      </section>

      <section className="approach shell">
        <div className="approach-heading">
          <p className="law-kicker">The approach</p>
          <h2>A founder site should make the next decision clearer.</h2>
        </div>
        <div className="approach-copy">
          <p>
            The strongest public work does more than announce a result. It preserves the
            context, tradeoffs, and reasoning that made the result possible.
          </p>
          <p>
            This site keeps the editorial workflow familiar in WordPress and gives readers
            a fast, focused experience through Next.js.
          </p>
          <Link className="line-link" href="/about">
            See how the system works
          </Link>
        </div>
      </section>

      <section className="process-section">
        <div className="shell">
          <div className="process-heading">
            <p className="law-kicker">How the work moves</p>
            <h2>From a live question to a durable point of view.</h2>
          </div>
          <ol className="process-list">
            <li>
              <span>01</span>
              <h3>Notice the signal</h3>
              <p>Find the decision, constraint, or lesson worth preserving.</p>
            </li>
            <li>
              <span>02</span>
              <h3>Make it useful</h3>
              <p>Remove the performance and keep the evidence another person can use.</p>
            </li>
            <li>
              <span>03</span>
              <h3>Publish with intent</h3>
              <p>Give the idea a clear home and let it compound through future work.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="capabilities shell">
        <div className="capabilities-intro">
          <p className="law-kicker">Areas of focus</p>
          <h2>Useful thinking, built close to the work.</h2>
        </div>
        <div className="capability-grid">
          {capabilities.map((capability) => (
            <article key={capability.title}>
              <div aria-hidden="true" className="capability-mark" />
              <h3>{capability.title}</h3>
              <p>{capability.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="notes-section shell" aria-labelledby="latest-notes">
        <div className="section-heading">
          <div>
            <p className="law-kicker">From WordPress</p>
            <h2 id="latest-notes">Latest writing</h2>
          </div>
          <Link className="line-link" href="/blog">
            Browse the archive
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="post-grid">
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} priority={index === 0} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>The archive is ready for its first note.</p>
            <p>Publish in WordPress and the work will appear here automatically.</p>
          </div>
        )}
      </section>

      <section className="closing-cta">
        <div className="shell closing-cta-inner">
          <p>Build the record while you build the work.</p>
          <Link className="law-button law-button-primary" href="/blog">
            Read the latest notes
          </Link>
        </div>
      </section>
    </main>
  );
}
