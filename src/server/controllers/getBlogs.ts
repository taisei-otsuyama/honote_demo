import { RouteHandler } from "@hono/zod-openapi";
import { getBlogsRoute } from "../routes/blogRoutes";
import { prisma } from "@/app/lib/prisma";

export const getBlogsHandler: RouteHandler<typeof getBlogsRoute> = async (
  c
) => {
  const blogs: ({
    user: {
      name: string | null;
      image: string | null;
    };
  } & {
    content: string;
    title: string;
    id: number;
    createdAt: Date;
    userId: string;
  })[] = await prisma.blog.findMany({
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return c.json(blogs, 200);
};
