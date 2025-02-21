import { RouteHandler } from "@hono/zod-openapi";
import { getBlogsRoute } from "../routes/blogRoutes";
import { prisma } from "@/app/lib/prisma";

export const getBlogsHandler: RouteHandler<typeof getBlogsRoute> = async (c) => {
  const query = c.req.query();
  const page = query.page ? parseInt(query.page, 10) : 1;
  const limit = query.limit ? parseInt(query.limit, 10) : 20;
  
  const skip = (page - 1) * limit;
  
  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: skip,
    }),
    prisma.blog.count({
      where: {
        isDeleted: false,
      },
    }),
  ]);

  const formattedBlogs = blogs.map((blog) => ({
    id: blog.id,
    title: blog.title,
    content: blog.content,
    createdAt: blog.createdAt.toISOString(),
    isDeleted: blog.isDeleted,
    userId: blog.userId,
    user: {
      name: blog.user.name,
      image: blog.user.image,
    },
  }));

  return c.json({
    blogs: formattedBlogs,
    hasMore: total > skip + blogs.length,
    total,
  }, 200);
};
