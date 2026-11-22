import Markdown from "react-markdown";
import { highlightCode } from "@/lib/blog/highlight";

type Segment =
  | { type: "markdown"; value: string }
  | { type: "code"; lang: string; value: string };

function splitMarkdownSegments(source: string): Segment[] {
  const segments: Segment[] = [];
  const fence = /```([\w-]*)\r?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = fence.exec(source)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "markdown",
        value: source.slice(lastIndex, match.index),
      });
    }
    segments.push({
      type: "code",
      lang: match[1] || "plaintext",
      value: match[2].replace(/\n$/, ""),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < source.length) {
    segments.push({ type: "markdown", value: source.slice(lastIndex) });
  }

  return segments;
}

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-3 leading-relaxed">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-medium text-on-background">{children}</strong>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      className="text-on-tertiary-container underline-offset-4 hover:underline"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-6 list-disc space-y-2 pl-6">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-6 list-decimal space-y-2 pl-6">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mb-4 mt-10 text-2xl font-medium text-on-background">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mb-3 mt-8 text-xl font-medium text-on-background">
      {children}
    </h3>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="rounded-sm bg-surface-container-low px-1.5 py-0.5 font-mono text-[0.9em] text-on-background">
      {children}
    </code>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic">{children}</em>
  ),
  hr: () => <hr className="my-10 border-subtle" />,
};

export async function BlogMarkdown({
  content,
}: {
  content: string;
}): Promise<React.ReactElement> {
  const segments = splitMarkdownSegments(content);

  const rendered = await Promise.all(
    segments.map(async (segment, index) => {
      if (segment.type === "markdown") {
        if (!segment.value.trim()) return null;
        return (
          <Markdown key={`md-${index}`} components={markdownComponents}>
            {segment.value}
          </Markdown>
        );
      }

      const html = await highlightCode(segment.value, segment.lang);
      return (
        <div
          className="blog-code mb-6 overflow-x-auto border border-subtle bg-surface-container-low"
          // Highlighted by Shiki (AL grammar from Microsoft TextMate).
          dangerouslySetInnerHTML={{ __html: html }}
          key={`code-${index}`}
        />
      );
    }),
  );

  return <>{rendered}</>;
}
