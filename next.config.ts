import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 2,
  },
  async redirects() {
    return [
      {
        source: "/admin/pages",
        destination: "/admin/institutional-pages",
        permanent: false,
      },
      {
        source: "/news-and-events",
        destination: "/events",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
