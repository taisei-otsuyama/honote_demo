import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { updateBlogByIdRoute } from "../routes/blogRoutes";
import { RouteHandler } from "@hono/zod-openapi";

export const updateBlogHandler: RouteHandler<
  typeof updateBlogByIdRoute
> = async (c) => {
  const { id } = c.req.param();
  const { title, content } = c.req.valid("json");

  const session = await auth();

  if (!session?.user?.id) {
    throw Error("認証してください。");
  }

  const blogs = await prisma.blog.update({
    where: { id: Number(id) },
    data: {
      title,
      content,
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

  return c.json(blogs, 201);
};
