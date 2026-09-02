import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WpContent } from "@/components/wp-content";
import {
  authorName,
  contentMetadata,
  getPostBySlug,
  getPosts,
  plainText,
} from "@/lib/wordpress";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPosts(100);

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return post ? contentMetadata(post) : { title: "Post not found" };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const author = authorName(post);

  return (
    <main className="article-page shell" id="main-content">
      <Link className="back-link" href="/blog">
        Back to writing
      </Link>
      <article>
        <header className="article-header">
          <p className="article-meta">
            <time dateTime={post.date}>
              {new Intl.DateTimeFormat("en", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(post.date))}
            </time>
            {author ? <span>Written by {author}</span> : null}
          </p>
          <h1>{plainText(post.title.rendered)}</h1>
          <p>{plainText(post.excerpt.rendered)}</p>
        </header>
        <WpContent html={post.content.rendered} />
      </article>
    </main>
  );
}
