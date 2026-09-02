import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WpContent } from "@/components/wp-content";
import { contentMetadata, getPageBySlug, plainText } from "@/lib/wordpress";

type ContentPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  return page ? contentMetadata(page) : { title: "Page not found" };
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="article-page page-content shell" id="main-content">
      <article>
        <header className="article-header">
          <p className="kicker">{new Date(page.modified).toLocaleDateString("en")}</p>
          <h1>{plainText(page.title.rendered)}</h1>
          {plainText(page.excerpt.rendered) ? (
            <p>{plainText(page.excerpt.rendered)}</p>
          ) : null}
        </header>
        <WpContent html={page.content.rendered} />
      </article>
    </main>
  );
}

