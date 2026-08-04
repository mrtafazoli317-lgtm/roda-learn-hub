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
  "UL",
  "OL",
  "LI",
  "A",
  "IMG",
  "BLOCKQUOTE",
  "DIV",
  "SPAN",
  "FIGURE",
]);

const ALLOWED_ATTRS: Record<string, string[]> = {
  A: ["href", "target", "rel"],
  IMG: ["src", "alt", "loading"],
};

function isSafeUrl(url: string) {
  const v = url.trim().toLowerCase();
  return (
    v.startsWith("http://") || v.startsWith("https://") || v.startsWith("/") || v.startsWith("data:image/")
  );
}

/** Minimal allow-list sanitizer for admin-authored article HTML. */
export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined" || !html) return "";
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild;
  if (!root) return "";

  const walk = (node: Element) => {
    [...node.children].forEach((child) => {
      if (!ALLOWED_TAGS.has(child.tagName)) {
        child.replaceWith(...Array.from(child.childNodes));
        return;
      }
      const allowed = ALLOWED_ATTRS[child.tagName] ?? [];
      [...child.attributes].forEach((attr) => {
        if (!allowed.includes(attr.name.toLowerCase())) child.removeAttribute(attr.name);
      });
      const src = child.getAttribute("src");
      if (src && !isSafeUrl(src)) child.removeAttribute("src");
      const href = child.getAttribute("href");
      if (href && !isSafeUrl(href)) child.removeAttribute("href");
      if (child.tagName === "A") {
        child.setAttribute("rel", "noopener noreferrer");
        child.setAttribute("target", "_blank");
      }
      if (child.tagName === "IMG") child.setAttribute("loading", "lazy");
      walk(child);
    });
  };
  walk(root);
  return root.innerHTML;
}

/** Renders plain text (no tags) as paragraphs, otherwise sanitized HTML. */
export function toArticleHtml(content: string): string {
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
