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

type WordPressComAuthor = {
  ID: number;
  name: string;
};

type WordPressComContent = {
  ID: number;
  date: string;
  modified: string;
  slug: string;
  URL: string;
  title: string;
  excerpt: string;
  content: string;
  author?: WordPressComAuthor;
  featured_image?: string;
};

type WordPressComCollection = {
  posts: WordPressComContent[];
};

type WordPressComSite = {
  name: string;
  description: string;
  URL: string;
  lang?: string | false;
};

const useDemoContent =
  process.env.STATIC_EXPORT === "true" || process.env.DEMO_CONTENT === "true";

const staticSite: SiteSettings = {
  name: "The Founder Site",
  description: "Build the work. Explain the thinking.",
  language: "en-US",
  frontend_url: "https://ktg1.github.io/wordpress-back-end-nextjs-site",
  front_page_id: 0,
  posts_page_id: 0,
};

const staticPosts: WordPressContent[] = [
  {
    id: 3,
    date: "2026-09-02T09:00:00",
    modified: "2026-09-02T09:00:00",
    slug: "what-a-founder-site-should-do",
    link: "",
    title: { rendered: "What a founder site should actually do" },
    excerpt: {
      rendered:
        "A useful founder site is not a monument. It is a clear, living record of the work and the thinking behind it.",
    },
    content: {
      rendered:
        "<p>A founder site should make the next useful conversation easier. It should show what you are building, explain how you think, and give people a direct path to the work.</p><h2>Make the signal obvious</h2><p>Readers should understand the subject, the point of view, and why it matters within a few moments. Clear writing earns attention more reliably than ornamental positioning.</p><h2>Keep the system close to the work</h2><p>WordPress provides a familiar editorial workspace. Next.js turns that material into a focused reading experience. The separation lets each system do the job it is best at.</p>",
    },
    meta: {
      headless_seo_title: "What a founder site should actually do",
      headless_seo_description:
        "A practical view of what makes a founder site useful, clear, and durable.",
    },
    _embedded: { author: [{ id: 1, name: "Founder Site Editorial" }] },
  },
  {
    id: 2,
    date: "2026-08-26T09:00:00",
    modified: "2026-08-26T09:00:00",
    slug: "notes-from-building-in-public",
    link: "",
    title: { rendered: "Notes from building in public" },
    excerpt: {
      rendered:
        "The strongest public work is specific enough to be useful and honest enough to reveal how the decisions were made.",
    },
    content: {
      rendered:
        "<p>Building in public works when the record is useful on its own. The goal is not constant narration; it is to preserve the decisions, constraints, and lessons that would otherwise disappear.</p><blockquote><p>Publish only what makes the next decision clearer.</p></blockquote><p>A compact field note can do more than a polished announcement when it gives the reader something concrete to test.</p>",
    },
    meta: {
      headless_seo_title: "Notes from building in public",
      headless_seo_description:
        "How to share work in public without turning the work itself into performance.",
    },
    _embedded: { author: [{ id: 1, name: "Founder Site Editorial" }] },
  },
  {
    id: 1,
    date: "2026-08-19T09:00:00",
    modified: "2026-08-19T09:00:00",
    slug: "designing-an-editorial-system",
    link: "",
    title: { rendered: "Designing an editorial system that lasts" },
    excerpt: {
      rendered:
        "Good publishing systems reduce friction for editors without transferring that complexity to readers.",
    },
    content: {
      rendered:
        "<p>An editorial system lasts when publishing feels ordinary. Editors need a comfortable place to draft and manage content; readers need fast pages with a coherent visual language.</p><h2>Separate responsibilities</h2><p>Use the content management system for editorial operations and the frontend for presentation. Connect them with a small, explicit API contract that can be tested and replaced.</p><h2>Design for recovery</h2><p>Builds should fail clearly, content should remain in one durable source, and the public site should have a predictable path back to a healthy state.</p>",
    },
    meta: {
      headless_seo_title: "Designing an editorial system that lasts",
      headless_seo_description:
        "A durable approach to joining a WordPress editorial workflow to a modern frontend.",
    },
    _embedded: { author: [{ id: 1, name: "Founder Site Editorial" }] },
  },
];

const staticPages: WordPressContent[] = [
  {
    id: 4,
    date: "2026-08-19T09:00:00",
    modified: "2026-09-02T09:00:00",
    slug: "about",
    link: "",
    title: { rendered: "About" },
    excerpt: {
      rendered: "A practical publishing system for work worth explaining.",
    },
    content: {
      rendered:
        "<p>The Founder Site is a headless publishing project: WordPress is the editorial source and Next.js is the public experience.</p><p>It is built for clear field notes, durable ideas, and direct access to the thinking behind the work.</p><h2>The architecture</h2><p>Editors publish in WordPress. The frontend reads structured content through the WordPress REST API, renders it with Next.js, and refreshes affected routes through a signed webhook.</p>",
    },
    meta: {
      headless_seo_title: "About the Founder Site",
      headless_seo_description:
        "About the WordPress and Next.js publishing system behind the Founder Site.",
    },
  },
];

const apiBase = (process.env.WORDPRESS_API_URL ?? "http://localhost:8080/wp-json").replace(
  /\/$/,
  "",
);
const wordpressComSite = process.env.WORDPRESS_COM_SITE?.trim();
const wordpressComApiBase = wordpressComSite
  ? `https://public-api.wordpress.com/rest/v1.1/sites/${encodeURIComponent(wordpressComSite)}`
  : null;

async function fetchJson<T>(url: string, revalidate: number): Promise<T | null> {
  try {
    const response = await fetch(url, {
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

async function wpFetch<T>(path: string, revalidate = 60): Promise<T | null> {
  return fetchJson<T>(`${apiBase}${path}`, revalidate);
}

async function wpComFetch<T>(path: string, revalidate = 60): Promise<T | null> {
  if (!wordpressComApiBase) {
    return null;
  }

  return fetchJson<T>(`${wordpressComApiBase}${path}`, revalidate);
}

function fromWordPressCom(item: WordPressComContent): WordPressContent {
  const featuredMedia = item.featured_image
    ? [
        {
          id: item.ID,
          alt_text: plainText(item.title),
          source_url: item.featured_image,
        },
      ]
    : undefined;

  return {
    id: item.ID,
    date: item.date,
    modified: item.modified,
    slug: item.slug,
    link: item.URL,
    title: { rendered: item.title },
    excerpt: { rendered: item.excerpt },
    content: { rendered: item.content },
    _embedded: {
      ...(featuredMedia ? { "wp:featuredmedia": featuredMedia } : {}),
      ...(item.author
        ? { author: [{ id: item.author.ID, name: item.author.name }] }
        : {}),
    },
  };
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
  if (useDemoContent) {
    return staticSite;
  }

  if (wordpressComSite) {
    const site = await wpComFetch<WordPressComSite>("", 300);

    return site
      ? {
          name: site.name,
          description: site.description,
          language: site.lang || "en-US",
          frontend_url: process.env.SITE_URL ?? site.URL,
          front_page_id: 0,
          posts_page_id: 0,
        }
      : null;
  }

  return wpFetch<SiteSettings>("/headless/v1/site", 300);
}

export async function getPosts(perPage = 12): Promise<WordPressContent[]> {
  if (useDemoContent) {
    return staticPosts.slice(0, perPage);
  }

  if (wordpressComSite) {
    const collection = await wpComFetch<WordPressComCollection>(
      `/posts/?number=${perPage}&type=post&order_by=date&order=DESC`,
    );

    return collection?.posts.map(fromWordPressCom) ?? [];
  }

  return (
    (await wpFetch<WordPressContent[]>(
      `/wp/v2/posts?${contentQuery({ per_page: perPage, orderby: "date", order: "desc" })}`,
    )) ?? []
  );
}

export async function getPostBySlug(slug: string): Promise<WordPressContent | null> {
  if (useDemoContent) {
    return staticPosts.find((post) => post.slug === slug) ?? null;
  }

  if (wordpressComSite) {
    const post = await wpComFetch<WordPressComContent>(
      `/posts/slug:${encodeURIComponent(slug)}`,
    );

    return post ? fromWordPressCom(post) : null;
  }

  const posts = await wpFetch<WordPressContent[]>(
    `/wp/v2/posts?${contentQuery({ slug, per_page: 1 })}`,
  );

  return posts?.[0] ?? null;
}

export async function getPages(perPage = 100): Promise<WordPressContent[]> {
  if (useDemoContent) {
    return staticPages.slice(0, perPage);
  }

  if (wordpressComSite) {
    const collection = await wpComFetch<WordPressComCollection>(
      `/posts/?number=${perPage}&type=page&order_by=menu_order&order=ASC`,
      300,
    );

    return collection?.posts.map(fromWordPressCom) ?? [];
  }

  return (
    (await wpFetch<WordPressContent[]>(
      `/wp/v2/pages?${contentQuery({ per_page: perPage, orderby: "menu_order", order: "asc" })}`,
      300,
    )) ?? []
  );
}

export async function getPageBySlug(slug: string): Promise<WordPressContent | null> {
  if (useDemoContent) {
    return staticPages.find((page) => page.slug === slug) ?? null;
  }

  if (wordpressComSite) {
    const page = await wpComFetch<WordPressComContent>(
      `/posts/slug:${encodeURIComponent(slug)}`,
    );

    return page ? fromWordPressCom(page) : null;
  }

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
