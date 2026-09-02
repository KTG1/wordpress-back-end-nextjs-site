import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Writing",
  description: "Field notes, decisions, and lessons from the work.",
};

export default async function BlogPage() {
  const posts = await getPosts(24);

  return (
    <main className="archive shell" id="main-content">
      <header className="archive-header">
        <p className="kicker">The working archive</p>
        <h1>Writing</h1>
        <p>Notes written close to the work, kept useful after the moment passes.</p>
      </header>

      {posts.length > 0 ? (
        <div className="post-grid archive-grid">
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} priority={index === 0} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>The archive is ready for its first post.</p>
          <p>Publish a post in WordPress to populate this page.</p>
        </div>
      )}
    </main>
  );
}
