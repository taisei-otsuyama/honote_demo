import { RouteHandler } from "@hono/zod-openapi";
import { getBlogsRoute } from "../routes/blogRoutes";
import { prisma } from "@/app/lib/prisma";

export const getBlogsHandler: RouteHandler<typeof getBlogsRoute> = async (
  c
) => {
  const blogs = await prisma.blog.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return c.json(
    blogs.map((blog) => ({
      ...blog,
      createdAt: blog.createdAt.toISOString(),
    })),
    200
  );
};
