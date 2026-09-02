# Headless WordPress + Next.js

A production-minded starter that keeps editorial work in WordPress and serves the public site with Next.js.

## Live demo

The Next.js frontend is published at <https://ktg1.github.io/wordpress-back-end-nextjs-site/>.

GitHub Pages can only serve static files, so the demo contains a build-time snapshot of the example WordPress content. The regular Next.js build remains connected to the WordPress REST API and publish webhook for deployment on a server-capable host.

For a Vercel preview before WordPress has a public URL, set `DEMO_CONTENT=true`. Remove that variable after configuring the production WordPress URLs to switch back to live REST API content.

## Architecture

```text
Editor -> WordPress admin -> WordPress REST API -> Next.js server -> Visitor
                    \-> publish webhook -> Next.js route revalidation
```

- **WordPress** owns posts, pages, media, authors, and SEO fields.
- **Next.js** owns routing, rendering, metadata, the sitemap, and the public design.
- **MySQL** stores WordPress data.
- **Headless Site Core** connects publishing events to Next.js cache revalidation.

## Start locally

Requirements: Docker with Docker Compose.

```bash
cp .env.example .env
# Replace every `replace-with-...` value in .env first.
make setup
```

Then open:

- Public frontend: <http://localhost:3000>
- WordPress admin: <http://localhost:8080/wp-admin>
- WordPress REST API: <http://localhost:8080/wp-json>

Run `make seed` if you want one example page and post. Publishing or updating content in WordPress revalidates the corresponding Next.js route.

## Run the frontend without Docker

Start WordPress first, then:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## Content routes

| WordPress content | Next.js URL |
| --- | --- |
| Posts | `/blog` |
| One post | `/blog/{slug}` |
| Pages | `/{slug}` |
| REST API | WordPress only; never exposed as the main site |

The plugin adds an **SEO & social preview** box to posts and pages. Its title and description flow into Next.js metadata without requiring a third-party WordPress plugin.

## Production configuration

Set these secrets and environment variables in your hosting platform:

- WordPress: `HEADLESS_FRONTEND_URL`, `HEADLESS_REVALIDATION_SECRET`
- Next.js: `SITE_URL`, `WORDPRESS_API_URL`, `WORDPRESS_PUBLIC_URL`, `REVALIDATION_SECRET`

Use the private/internal WordPress URL for `WORDPRESS_API_URL` when your hosts share a network. Use the browser-accessible WordPress URL for `WORDPRESS_PUBLIC_URL`. The two `REVALIDATION_SECRET` values must match.

Before launch:

1. Put both applications behind HTTPS.
2. Replace all example credentials and rotate the database passwords.
3. Restrict the WordPress origin with a firewall or access policy while keeping `/wp-json/` and media reachable by Next.js.
4. Configure backups for both Docker volumes or use managed WordPress/MySQL.
5. Add image-domain configuration in `frontend/next.config.ts` if media uses a CDN.

## Useful commands

```bash
make up       # Build and start the complete stack
make setup    # Install/configure WordPress and start the frontend
make seed     # Add minimal example content
make logs     # Follow application logs
make down     # Stop containers without deleting data
```

The `clean` target deliberately does not delete persistent data. If you intentionally want a fresh database, run `docker compose down --volumes` yourself.
