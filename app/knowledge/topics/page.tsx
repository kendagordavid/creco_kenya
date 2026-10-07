import { permanentRedirect } from "next/navigation";

/** Topic index lives at /topics; this path is kept for bookmarks and old links. */
export default function KnowledgeTopicsIndexPage() {
  permanentRedirect("/topics");
}
