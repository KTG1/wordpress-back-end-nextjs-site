import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";
const repositoryBasePath = "/wordpress-back-end-nextjs-site";

const wordpressUrl = new URL(
  process.env.WORDPRESS_PUBLIC_URL ?? "http://localhost:8080",
);

const nextConfig: NextConfig = {
  agentRules: false,
  output: isStaticExport ? "export" : "standalone",
  basePath: isStaticExport ? repositoryBasePath : undefined,
  trailingSlash: isStaticExport,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      {
        protocol: wordpressUrl.protocol.replace(":", "") as "http" | "https",
        hostname: wordpressUrl.hostname,
        port: wordpressUrl.port,
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
