import sanitizeHtml from "sanitize-html";

export type RenderedText = {
  rendered: string;
};

export type WordPressMedia = {
  id: number;
  alt_text: string;
  source_url: string;
  media_details?: {
    width?: number;
    height?: number;
  };
};

export type WordPressAuthor = {
  id: number;
  name: string;
};

export type WordPressContent = {
  id: number;
  date: string;
  modified: string;
  slug: string;
  link: string;
  title: RenderedText;
  excerpt: RenderedText;
  content: RenderedText;
  headless_path?: string;
  meta?: {
    headless_seo_title?: string;
    headless_seo_description?: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: WordPressMedia[];
    author?: WordPressAuthor[];
  };
};

export type SiteSettings = {
  name: string;
  description: string;
  language: string;
  frontend_url: string;
  front_page_id: number;
  posts_page_id: number;
};

const apiBase = (process.env.WORDPRESS_API_URL ?? "http://localhost:8080/wp-json").replace(
  /\/$/,
  "",
);

async function wpFetch<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const response = await fetch(`${apiBase}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

const collectionFields = [
  "id",
  "date",
  "modified",
  "slug",
  "link",
  "title",
  "excerpt",
  "content",
  "meta",
  "headless_path",
  "_links",
  "_embedded",
].join(",");

function contentQuery(extra: Record<string, string | number> = {}): string {
  const params = new URLSearchParams({
    _embed: "wp:featuredmedia,author",
    _fields: collectionFields,
    ...Object.fromEntries(
      Object.entries(extra).map(([key, value]) => [key, String(value)]),
    ),
  });

  return params.toString();
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return wpFetch<SiteSettings>("/headless/v1/site", 300);
}

export async function getPosts(perPage = 12): Promise<WordPressContent[]> {
  return (
    (await wpFetch<WordPressContent[]>(
      `/wp/v2/posts?${contentQuery({ per_page: perPage, orderby: "date", order: "desc" })}`,
    )) ?? []
  );
}

export async function getPostBySlug(slug: string): Promise<WordPressContent | null> {
  const posts = await wpFetch<WordPressContent[]>(
    `/wp/v2/posts?${contentQuery({ slug, per_page: 1 })}`,
  );

  return posts?.[0] ?? null;
}

export async function getPages(perPage = 100): Promise<WordPressContent[]> {
  return (
    (await wpFetch<WordPressContent[]>(
      `/wp/v2/pages?${contentQuery({ per_page: perPage, orderby: "menu_order", order: "asc" })}`,
      300,
    )) ?? []
  );
}

export async function getPageBySlug(slug: string): Promise<WordPressContent | null> {
  const pages = await wpFetch<WordPressContent[]>(
    `/wp/v2/pages?${contentQuery({ slug, per_page: 1 })}`,
  );

  return pages?.[0] ?? null;
}

export function plainText(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "figure",
      "figcaption",
      "iframe",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel"],
      img: ["src", "srcset", "sizes", "alt", "width", "height", "loading"],
      iframe: ["src", "title", "width", "height", "allow", "allowfullscreen"],
      "*": ["class"],
    },
    allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noreferrer noopener" }, true),
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }, true),
    },
  });
}

export function featuredImage(content: WordPressContent): WordPressMedia | null {
  return content._embedded?.["wp:featuredmedia"]?.[0] ?? null;
}

export function authorName(content: WordPressContent): string | null {
  return content._embedded?.author?.[0]?.name ?? null;
}

export function contentMetadata(content: WordPressContent) {
  const fallbackDescription = plainText(content.excerpt.rendered).slice(0, 160);

  return {
    title: content.meta?.headless_seo_title || plainText(content.title.rendered),
    description: content.meta?.headless_seo_description || fallbackDescription,
  };
}

