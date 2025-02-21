import { createRoute, z } from "@hono/zod-openapi";
import {
  BlogIdSchema,
  BlogSchema,
  BlogsSchema,
  CreateBlogSchema,
  UpdateBlogSchema,
} from "../models/blogSchemas";

export const getBlogsRoute = createRoute({
  path: "/",
  method: "get",
  description: "ブログの一覧を取得（ページネーション対応）",
  request: {
    query: z.object({
      page: z
        .string()
        .regex(/^\d+$/)
        .transform(Number)
        .optional()
        .openapi({ example: "1" }),
      limit: z
        .string()
        .regex(/^\d+$/)
        .transform(Number)
        .optional()
        .openapi({ example: "20" }),
    }),
  },
  responses: {
    200: {
      description: "取得成功",
      content: {
        "application/json": {
          schema: BlogsSchema,
        },
      },
    },
  },
});

export const getBlogByIdRoute = createRoute({
  path: "/{id}",
  method: "get",
  description: "個別のブログ記事を取得",
  request: {
    params: BlogIdSchema,
  },
  responses: {
    200: {
      description: "取得成功",
      content: { "application/json": { schema: BlogSchema } },
    },
    404: {
      description: "ブログが見つかりませんでした。",
      content: {
        "application/json": {
          schema: z.null(),
        },
      },
    },
  },
});

export const createBlogRoute = createRoute({
  path: "/",
  method: "post",
  description: "新しいブログを作成",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateBlogSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "作成成功",
      content: {
        "application/json": {
          schema: BlogSchema,
        },
      },
    },
  },
});

export const updateBlogByIdRoute = createRoute({
  path: "/{id}/update",
  method: "post",
  description: "ブログを更新",
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpdateBlogSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "更新成功",
      content: {
        "application/json": {
          schema: BlogSchema,
        },
      },
    },
    200: { description: "削除済み" },
  },
});

export const deleteBlogByIdRoute = createRoute({
  path: "/{id}/delete",
  method: "post",
  description: "ブログを削除",
  request: {
    body: {
      content: {
        "application/json": {
          schema: BlogIdSchema,
        },
      },
    },
  },
  responses: {
    200: { description: "削除成功" },
  },
});
