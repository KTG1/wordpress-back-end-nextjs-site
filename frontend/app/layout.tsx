import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/wordpress";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  const title = site?.name || "Founder Site";
  const description =
    site?.description || "Independent work, writing, and ideas published with intent.";

  return {
    metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
    title: {
      default: title,
      template: `%s · ${title}`,
    },
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = await getSiteSettings();

  return (
    <html lang={site?.language?.split("-")[0] || "en"}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader siteName={site?.name} />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

