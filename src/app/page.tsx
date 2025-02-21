import { hono } from "./lib/hono";
import BlogList from "@/components/blogList";

export default async function Page() {
  const res = await hono.api.blogs.$get({
    query: {
      page: "1",
      limit: "20",
    },
  });
  const { blogs, hasMore } = await res.json();

  return <BlogList initialBlogs={blogs} initialHasMore={hasMore} />;
}
