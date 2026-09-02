import { cleanContent } from "@/lib/wordpress";

type WpContentProps = {
  html: string;
};

export function WpContent({ html }: WpContentProps) {
  return (
    <div
      className="wp-content"
      dangerouslySetInnerHTML={{ __html: cleanContent(html) }}
    />
  );
}

