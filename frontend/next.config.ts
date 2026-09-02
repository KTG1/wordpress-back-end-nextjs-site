import type { NextConfig } from "next";

const wordpressUrl = new URL(
  process.env.WORDPRESS_PUBLIC_URL ?? "http://localhost:8080",
);

const nextConfig: NextConfig = {
  agentRules: false,
  output: "standalone",
  turbopack: {
    root: process.cwd(),
  },
  images: {
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
