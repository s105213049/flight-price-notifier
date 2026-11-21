import { useEffect } from "react";

type PageMeta = { title: string; description?: string; robots?: string };

function setMeta(attr: "name" | "property", key: string, content: string | undefined) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (content === undefined) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Sets the document title and description meta tags for the current page. */
export function usePageMeta({ title, description, robots }: PageMeta) {
  useEffect(() => {
    document.title = title;
    setMeta("property", "og:title", title);
    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
    }
    setMeta("name", "robots", robots);
  }, [title, description, robots]);
}
