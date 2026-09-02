import Image from "next/image";
import Link from "next/link";
import { featuredImage, plainText, type WordPressContent } from "@/lib/wordpress";

type PostCardProps = {
  post: WordPressContent;
  priority?: boolean;
};

export function PostCard({ post, priority = false }: PostCardProps) {
  const image = featuredImage(post);

  return (
    <article className="post-card">
      {image ? (
        <Link className="post-card-image" href={`/blog/${post.slug}`} tabIndex={-1}>
          <Image
            alt={image.alt_text || ""}
            height={image.media_details?.height ?? 720}
            priority={priority}
            src={image.source_url}
            width={image.media_details?.width ?? 1080}
          />
        </Link>
      ) : (
        <div aria-hidden="true" className="post-card-placeholder">
          <span>{String(post.id).padStart(3, "0")}</span>
        </div>
      )}
      <div className="post-card-body">
        <time dateTime={post.date}>
          {new Intl.DateTimeFormat("en", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(post.date))}
        </time>
        <h2>
          <Link href={`/blog/${post.slug}`}>{plainText(post.title.rendered)}</Link>
        </h2>
        <p>{plainText(post.excerpt.rendered)}</p>
        <Link className="text-link" href={`/blog/${post.slug}`}>
          Read note <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}

