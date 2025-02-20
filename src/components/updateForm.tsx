"use client";

import { hono } from "../app/lib/hono";
import { UpdateBlog, UpdateBlogSchema } from "@/server/models/blogSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import LoadingIcon from "./loadingIcon";

type Props = {
  target_id: string;
};

export default function Page({ target_id }: Props) {
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(true);
  const [blog, setBlog] = useState<UpdateBlog | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateBlog>({
    resolver: zodResolver(UpdateBlogSchema),
  });

  const onSubmit = async (data: UpdateBlog) => {
    setIsFetching(true);
    const { title, content } = data;

    await hono.api.blogs[":id"].update.$post({
      param: { id: target_id },
      json: { title, content },
    });

    router.push(`/blogs/${target_id}`);
    router.refresh();
  };

  useEffect(() => {
    const fetchBlog = async () => {
      setIsFetching(true);
      const res = await hono.api.blogs[":id"].$get({
        param: { id: target_id },
      });
      const blog = await res.json();

      if (!blog) {
        return notFound();
      }

      setBlog(blog);
      reset({
        title: blog.title,
        content: blog.content,
      });
      setIsFetching(false);
    };

    fetchBlog();
  }, [target_id, reset]);

  if (isFetching) {
    return <LoadingIcon />;
  }

  if (!blog) {
    return notFound();
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 bg-white px-3">
      <div className="p-6 border border-gray-200 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          ブログを更新する
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              タイトル
            </label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="タイトルを入力"
                />
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">内容</label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 h-32"
                  placeholder="ブログの内容を入力"
                />
              )}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-300 py-1 px-3 rounded-full font-bold hover:bg-yellow-400 hover:shadow-md transition-all duration-200 ease-in-out active:scale-95"
          >
            更新する
          </button>
        </form>
      </div>
    </div>
  );
}
