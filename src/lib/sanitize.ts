const ALLOWED_TAGS = new Set([
  "P",
  "BR",
  "B",
  "STRONG",
  "I",
  "EM",
  "U",
  "H2",
  "H3",
  "H4",
  "UL",
  "OL",
  "LI",
  "A",
  "IMG",
  "BLOCKQUOTE",
  "DIV",
  "SPAN",
  "FIGURE",
  "FIGCAPTION",
  "HR",
]);

// `A` intentionally omits rel/target — they are always re-added safely below.
const ALLOWED_ATTRS: Record<string, string[]> = {
  A: ["href"],
  IMG: ["src", "alt"],
};

const VOID_TAGS = new Set(["BR", "IMG", "HR"]);

function isSafeUrl(url: string) {
  const v = url.trim().toLowerCase();
  return (
    v.startsWith("http://") ||
    v.startsWith("https://") ||
    v.startsWith("/") ||
    v.startsWith("data:image/")
  );
}

function escapeAttr(v: string) {
  return v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Isomorphic allow-list sanitizer for admin-authored article HTML.
 * Runs identically on the server (SSR/SEO) and in the browser — no DOM required.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  let out = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\s*(script|style|iframe|object|embed|form|svg|math)[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*\/?\s*(script|style|iframe|object|embed|form|svg|math)\b[^>]*>/gi, "");

  out = out.replace(
    /<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|'[^']*'|[^"'>])*)\/?\s*>/g,
    (_match, close: string, rawTag: string, rawAttrs: string) => {
      const name = rawTag.toUpperCase();
      if (!ALLOWED_TAGS.has(name)) return "";
      const tag = rawTag.toLowerCase();
      if (close) return VOID_TAGS.has(name) ? "" : `</${tag}>`;

      const allowed = ALLOWED_ATTRS[name] ?? [];
      const kept: string[] = [];
      const attrRe = /([a-zA-Z:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
      let attr: RegExpExecArray | null;
      while ((attr = attrRe.exec(rawAttrs)) !== null) {
        const key = attr[1]!.toLowerCase();
        const value = attr[2] ?? attr[3] ?? "";
        if (!allowed.includes(key)) continue;
        if ((key === "href" || key === "src") && !isSafeUrl(value)) continue;
        kept.push(`${key}="${escapeAttr(value)}"`);
      }

      if (name === "A") kept.push('rel="noopener noreferrer"', 'target="_blank"');
      if (name === "IMG") kept.push('loading="lazy"', 'decoding="async"');

      const attrs = kept.length ? ` ${kept.join(" ")}` : "";
      return VOID_TAGS.has(name) ? `<${tag}${attrs} />` : `<${tag}${attrs}>`;
    },
  );

  return out;
}

/** Renders plain text (no tags) as paragraphs, otherwise sanitized HTML. */
export function toArticleHtml(content: string): string {
  if (!content) return "";
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(content);
  if (!looksLikeHtml) {
    return content
      .split(/\n{2,}/)
      .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br />")}</p>`)
      .join("");
  }
  return sanitizeHtml(content);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
