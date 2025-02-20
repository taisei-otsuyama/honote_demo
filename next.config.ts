import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
